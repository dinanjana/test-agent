import { Judge, IJudge } from '../models/judge';
import { LLMService, LLMConfig, LLMProvider } from './llm.service';
import { SettingsService } from './settings.service';
import { parseLLMJson } from '../lib/parseLLMJson';
import { resolveTemplateVariables } from '../utils/templateVariables';

interface JudgeResult {
    judge_id: string;
    judge_name: string;
    passed: boolean;
    reasoning?: string;
    citation?: string; // Exact text span that caused the failure
    severity: 'fail' | 'warn';
    model?: string;
    criteria?: string;
}

export class JudgeService {
    static async createJudge(data: Partial<IJudge>): Promise<IJudge> {
        const judge = new Judge(data);
        return await judge.save();
    }

    static async getAllJudges(): Promise<IJudge[]> {
        return await Judge.find().sort({ created_at: -1 });
    }

    static async getJudgeById(id: string): Promise<IJudge | null> {
        return await Judge.findById(id);
    }

    static async updateJudge(id: string, data: Partial<IJudge>): Promise<IJudge | null> {
        return await Judge.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteJudge(id: string): Promise<boolean> {
        const result = await Judge.findByIdAndDelete(id);
        return !!result;
    }

    /**
     * Evaluate a conversation using a judge's criteria via LLM.
     * Fetches API key from app settings unless `apiKeyOverride` is provided.
     */
    static async evaluateWithJudge(
        judgeId: string,
        conversation: string,
        appId: string,
        apiKeyOverride?: string,
        rawResponses?: Record<string, any>[]
    ): Promise<JudgeResult> {
        const judge = await Judge.findById(judgeId);
        if (!judge) {
            throw new Error(`Judge not found: ${judgeId}`);
        }

        // Get the provider preference from judge (defaults to openai)
        const provider = (judge.llm_provider || 'openai') as LLMProvider;
        const model = judge.llm_model || 'gpt-4o-mini';

        // Use override if provided, otherwise fetch from app settings
        const apiKey = apiKeyOverride ?? await SettingsService.getApiKey(appId, provider);
        if (!apiKey) {
            return {
                judge_id: judgeId,
                judge_name: judge.name,
                passed: false,
                reasoning: `No API key configured for ${provider}. Configure it in Settings.`,
                severity: judge.severity,
                criteria: judge.criteria
            };
        }

        const llmConfig: LLMConfig = {
            provider,
            apiKey,
            model
        };

        const llmService = new LLMService(llmConfig);

        const resolvedCriteria = rawResponses?.length
            ? resolveTemplateVariables(judge.criteria, rawResponses)
            : judge.criteria;

        if (resolvedCriteria !== judge.criteria) {
            console.log(`[JudgeService] Resolved criteria: "${resolvedCriteria}"`);
        }

        const prompt = `You are an AI judge evaluating an agent's responses.

## Judge Criteria
${resolvedCriteria}

## Conversation to Evaluate
${conversation}

## Your Task
Evaluate whether the agent's responses pass or fail based on the criteria above.

IMPORTANT: If the agent FAILS, you MUST extract the EXACT substring from the agent's response that caused the violation. This will be used to highlight the problematic text.

Respond in this exact JSON format:
{
  "passed": true or false,
  "reasoning": "Brief explanation of your judgment",
  "citation": "The exact text from the agent response that violated the criteria (only if failed, otherwise null)"
}`;

        try {
            console.log(`[JudgeService] Running judge "${judge.name}" with ${provider}/${model}`);
            const response = await llmService.generateResponse(prompt);

            // Parse JSON response — strip markdown fences then parse
            const result = parseLLMJson<{ passed: boolean; reasoning: string; citation?: string | null }>(response);

            // Update judge stats
            await Judge.findByIdAndUpdate(judgeId, {
                $inc: {
                    evaluation_count: 1,
                    pass_count: result.passed ? 1 : 0
                },
                last_triggered_at: new Date()
            });

            return {
                judge_id: judgeId,
                judge_name: judge.name,
                passed: result.passed,
                reasoning: result.reasoning,
                citation: result.citation || undefined,
                severity: judge.severity,
                model,
                criteria: judge.criteria
            };
        } catch (error: any) {
            return {
                judge_id: judgeId,
                judge_name: judge.name,
                passed: false,
                reasoning: `Evaluation failed: ${error.message}`,
                severity: judge.severity,
                criteria: judge.criteria
            };
        }
    }
}

