import { TestResult } from '@repo/shared';
import { TestSuite, ITestSuite, IConversation } from '../models/testDataSet';
import { Environment, IEnvironment } from '../models/environment';
import { JudgeService } from './judge.service';
import { TestRun, ITestRun } from '../models/testRun';
import mongoose from 'mongoose';
import pLimit from 'p-limit';

interface AgentResponse {
    response: string;
    metadata?: any;
    error?: string;
}

interface TurnResult {
    role: 'user' | 'agent';
    input?: string;
    expected?: string;
    actual?: string;
    latency_ms?: number;
    error?: string;
    raw_response?: Record<string, any>;
}

interface JudgeResult {
    judge_id: string;
    judge_name: string;
    passed: boolean;
    reasoning?: string;
    citation?: string;
    severity: 'fail' | 'warn';
    model?: string;
    criteria?: string;
}

interface ConversationRunResult {
    conversation_id: string;
    conversation_name: string;
    _id: string;
    turns: TurnResult[];
    judge_results: JudgeResult[];
    overall_passed: boolean;
    total_latency_ms: number;
}

interface TestSuiteRunResult {
    suite_id: string;
    suite_name: string;
    environment_id: string;
    environment_name: string;
    conversations_passed: number;
    conversations_total: number;
    overall_passed: boolean;
    runs: ConversationRunResult[];
    started_at: Date;
    completed_at: Date;
}

// Legacy single-run result for backward compatibility
interface TestRunResult {
    _id: string;
    app_id: string;
    test_data_id: string;
    test_data_name: string;
    conversation_id?: string;
    conversation_name?: string;
    environment_id: string;
    environment_name: string;
    domain_id?: string;
    turns: TurnResult[];
    judge_results: JudgeResult[];
    overall_passed: boolean;
    total_latency_ms: number;
    started_at: Date;
    completed_at: Date;
}

export class RunnerService {
    /**
     * Executes a single turn conversation with an agent.
     */
    async runTurn(
        agentUrl: string,
        userMessage: string,
        headers: Record<string, string> = {},
        onToken?: (token: string) => void
    ): Promise<AgentResponse> {
        const isStreaming = !!onToken;
        console.log(`[Runner] Sending to ${agentUrl}: "${userMessage.substring(0, 50)}..." (Stream: ${isStreaming})`);

        try {
            const response = await fetch(agentUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: JSON.stringify({
                    message: userMessage,
                    stream: isStreaming
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                return {
                    response: '',
                    error: `HTTP ${response.status}: ${errorText}`
                };
            }

            const contentType = response.headers.get('content-type');
            if (isStreaming && contentType?.includes('text/event-stream') && response.body) {
                // Handle SSE Stream
                const decoder = new TextDecoder();
                let fullResponse = "";
                let metadata = {};
                let buffer = "";

                // @ts-expect-error — Node.js fetch ReadableStream is async-iterable at
                // runtime but @types/node does not yet expose the iterator symbol typing
                for await (const chunk of response.body) {
                    const text = decoder.decode(chunk as BufferSource, { stream: true });
                    // console.log("R: Chunk size", text.length);
                    buffer += text;

                    const lines = buffer.split('\n\n');
                    buffer = lines.pop() || ""; // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const jsonStr = line.slice(6);
                                if (jsonStr === '[DONE]') continue; // Standard OpenAI format

                                const data = JSON.parse(jsonStr);
                                if (data.token) {
                                    // console.log("R: Token", data.token); // Debug log
                                    onToken(data.token);
                                    fullResponse += data.token;
                                }
                                if (data.done) {
                                    metadata = {
                                        latency_ms: data.latency_ms,
                                        ...data
                                    };
                                }
                                if (data.error) throw new Error(data.error);
                            } catch (e) {
                                console.warn('SSE Parse Error:', e);
                            }
                        } else {
                            // console.log("R: Ignored line:", line.substring(0, 20));
                        }
                    }
                }

                return {
                    response: fullResponse,
                    metadata
                };
            }

            // Fallback to JSON
            const data = await response.json();
            return {
                response: data.response || data.message || JSON.stringify(data),
                metadata: data
            };
        } catch (error: any) {
            console.error('RunTurn Error:', error.message);
            return {
                response: '',
                error: error.message
            };
        }
    }

    /**
     * Runs all conversations in a test suite against an environment.
     * Returns aggregate results with individual conversation runs.
     */
    async runTestSuite(
        suiteId: string,
        environmentId: string,
        onToken?: (conversationId: string, conversationIndex: number, turnIndex: number, token: string) => void,
        signal?: AbortSignal
    ): Promise<TestSuiteRunResult> {
        const startedAt = new Date();

        // Fetch suite and environment
        const suite = await TestSuite.findById(suiteId);
        const environment = await Environment.findById(environmentId);

        if (!suite) {
            throw new Error('Test suite not found');
        }
        if (!environment) {
            throw new Error('Environment not found');
        }

        const conversations = suite.conversations;

        console.log(`[Runner] Starting suite "${suite.name}" with ${conversations.length} conversation(s)`);

        // Build headers from environment
        const headers: Record<string, string> = {};
        if (environment.auth_type === 'api_key' && environment.api_key_header && environment.auth_token) {
            headers[environment.api_key_header] = environment.auth_token;
        } else if (environment.auth_type === 'bearer' && environment.auth_token) {
            headers['Authorization'] = `Bearer ${environment.auth_token}`;
        }

        const appId = suite.app_id.toString();

        // Run conversations in parallel with concurrency limit
        const limit = pLimit(5); // Run 5 conversations concurrently

        const runPromises = conversations.map((conv, convIndex) => limit(async () => {
            if (signal?.aborted) return null;
            const convId = ((conv as any)._id || 'unknown').toString();
            const convStartedAt = new Date();
            const turnResults: TurnResult[] = [];
            let totalLatency = 0;

            // Execute each turn
            let turnIndex = 0;
            for (const turn of conv.turns) {
                if (turn.role === 'user') {
                    const currentTurnIndex = turnIndex;
                    const startTime = Date.now();
                    const response = await this.runTurn(
                        environment.endpoint_url || '',
                        turn.message || '',
                        headers,
                        onToken ? (token) => onToken(convId, convIndex, currentTurnIndex, token) : undefined
                    );
                    const latency = Date.now() - startTime;
                    totalLatency += latency;

                    turnResults.push({
                        role: 'user',
                        input: turn.message,
                        actual: response.response,
                        latency_ms: latency,
                        error: response.error,
                        raw_response: response.metadata && typeof response.metadata === 'object' ? response.metadata : undefined
                    });
                } else {
                    turnResults.push({
                        role: 'agent',
                        expected: turn.message
                    });
                }
                turnIndex++;
            }

            // Run judges - use conversation-specific judges or fall back to suite-level
            const judgeIds = conv.judge_ids?.length ? conv.judge_ids : suite.judge_ids;
            const judgeResults: JudgeResult[] = [];

            if (judgeIds && judgeIds.length > 0) {
                const conversation = turnResults
                    .filter(t => t.role === 'user' && t.actual)
                    .map(t => `User: ${t.input}\nAgent: ${t.actual}`)
                    .join('\n\n');

                // Collect raw JSON responses from agent turns for template variable resolution
                const rawResponses = turnResults
                    .filter(t => t.role === 'user' && t.raw_response)
                    .map(t => t.raw_response!);

                // Run judges in parallel for this conversation
                const judgePromises = judgeIds.map(async (judgeId) => {
                    const idStr = judgeId.toString();
                    try {
                        const result = await JudgeService.evaluateWithJudge(
                            idStr,
                            conversation,
                            appId,
                            undefined,
                            rawResponses.length > 0 ? rawResponses : undefined
                        );
                        return result;
                    } catch (error: any) {
                        console.error(`Judge ${idStr} failed:`, error);
                        return {
                            judge_id: idStr,
                            judge_name: 'Unknown',
                            passed: false,
                            reasoning: `Judge execution failed: ${error.message}`,
                            severity: 'fail'
                        } as JudgeResult;
                    }
                });

                const results = await Promise.all(judgePromises);
                judgeResults.push(...results);
            }

            // Determine pass/fail for this conversation
            const hasErrors = turnResults.some(t => t.error);
            const failedJudges = judgeResults.filter(j => !j.passed && j.severity === 'fail');
            const overallPassed = !hasErrors && failedJudges.length === 0;

            // Save individual run to database
            const testRun = new TestRun({
                app_id: suite.app_id,
                test_data_id: suiteId,
                test_data_name: suite.name,
                conversation_id: (conv as any)._id,
                conversation_name: conv.name,
                environment_id: environmentId,
                environment_name: environment.name,
                domain_id: suite.domain_id,
                turns: turnResults,
                judge_results: judgeResults,
                overall_passed: overallPassed,
                total_latency_ms: totalLatency,
                started_at: convStartedAt,
                completed_at: new Date()
            });

            const savedRun = await testRun.save();

            return {
                conversation_id: ((conv as any)._id || '').toString(),
                conversation_name: conv.name,
                _id: savedRun._id.toString(),
                turns: turnResults,
                judge_results: judgeResults,
                overall_passed: overallPassed,
                total_latency_ms: totalLatency
            } as ConversationRunResult;
        }));

        const allRuns = await Promise.all(runPromises);
        const runs = allRuns.filter((r): r is ConversationRunResult => r !== null);

        const completedAt = new Date();
        const conversationsPassed = runs.filter(r => r.overall_passed).length;

        console.log(`[Runner] Suite complete: ${conversationsPassed}/${runs.length} passed`);

        return {
            suite_id: suiteId,
            suite_name: suite.name,
            environment_id: environmentId,
            environment_name: environment.name,
            conversations_passed: conversationsPassed,
            conversations_total: runs.length,
            overall_passed: runs.length > 0 && conversationsPassed === runs.length,
            runs,
            started_at: startedAt,
            completed_at: completedAt
        };
    }

    /**
     * Legacy method: Runs a single conversation (first one) from a test suite.
     * Maintained for backward compatibility.
     */
    async runTestData(
        testDataId: string,
        environmentId: string
    ): Promise<TestRunResult> {
        const result = await this.runTestSuite(testDataId, environmentId);

        // Return first conversation's result in legacy format
        const firstRun = result.runs[0];
        const suite = await TestSuite.findById(testDataId);

        return {
            _id: firstRun?._id || '',
            app_id: suite?.app_id.toString() || '',
            test_data_id: testDataId,
            test_data_name: result.suite_name,
            conversation_id: firstRun?.conversation_id,
            conversation_name: firstRun?.conversation_name,
            environment_id: environmentId,
            environment_name: result.environment_name,
            domain_id: suite?.domain_id?.toString(),
            turns: firstRun?.turns || [],
            judge_results: firstRun?.judge_results || [],
            overall_passed: result.overall_passed,
            total_latency_ms: firstRun?.total_latency_ms || 0,
            started_at: result.started_at,
            completed_at: result.completed_at
        };
    }
}
