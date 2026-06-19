"use client"

import { useState, useRef } from "react"
import { apiClient } from "@/lib/api-client"
import { App, Environment } from "@/lib/types"
import { TestDataSet } from "@/components/test-data-types"

export function useTestRunner(
    currentApp: App | null,
    currentEnvironment: Environment | null
) {
    const [isRunning, setIsRunning] = useState(false)
    const [runResults, setRunResults] = useState<any>(null)

    // Streaming deduplication refs
    const streamBufferRef = useRef<Map<string, string>>(new Map())
    const lastSeqRef = useRef<Map<string, number>>(new Map())
    const rafIdRef = useRef<number | null>(null)

    const handleRun = async (dataset: TestDataSet, setSelectedDataSet: (ds: TestDataSet) => void) => {
        if (!currentApp || !currentEnvironment) {
            alert("Please configure an environment in the Connect tab first.")
            return
        }

        setIsRunning(true)
        setSelectedDataSet(dataset)
        console.log("Starting run for dataset:", dataset._id);

        // Initialize placeholders for streaming
        const hasConversations = dataset.conversations && dataset.conversations.length > 0;
        const initialConversations = hasConversations ? dataset.conversations : [{
            _id: 'legacy_conv',
            name: 'Conversation 1',
            turns: dataset.turns || [],
            judge_ids: []
        }];

        const initialRuns = initialConversations.map(c => ({
            conversation_id: c._id || 'legacy_conv',
            conversation_name: c.name,
            turns: c.turns.map((t: any) => ({
                role: t.role,
                input: t.role === 'user' ? t.message : undefined,
                expected: t.role === 'agent' ? t.message : undefined,
                actual: ''
            })),
            overall_passed: false
        }));

        setRunResults({
            conversations_passed: 0,
            conversations_total: initialRuns.length,
            runs: initialRuns
        });

        // Reset streaming refs
        streamBufferRef.current.clear();
        lastSeqRef.current.clear();
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }

        try {
            console.log("Fetching stream...");
            const res = await apiClient.stream(`/api/apps/${currentApp._id}/test-data/${dataset._id}/run-suite`, {
                environmentId: currentEnvironment._id,
                stream: true
            })

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to run suite: ${res.status} ${text}`);
            }

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const result = await res.json();
                console.log("Run completed (non-streaming):", result);
                setRunResults(result);
                return;
            }

            if (!res.body) throw new Error("No response body");

            console.log("Stream connected. Reading...");
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6);
                        try {
                            const data = JSON.parse(jsonStr);

                            if (data.token) {
                                // De-duplication check using sequence number
                                if (data.seq !== undefined) {
                                    const lastSeq = lastSeqRef.current.get(data.conversationId) ?? -1;
                                    if (data.seq <= lastSeq) continue; // Skip duplicate/out-of-order
                                    lastSeqRef.current.set(data.conversationId, data.seq);
                                }

                                // Buffer the token
                                const key = `${data.conversationId}-${data.turnIndex}`;
                                const currentBuffer = streamBufferRef.current.get(key) || "";
                                streamBufferRef.current.set(key, currentBuffer + data.token);

                                // Schedule flush if not already running
                                if (!rafIdRef.current) {
                                    rafIdRef.current = requestAnimationFrame(() => {
                                        setRunResults((prev: any) => {
                                            if (!prev || !prev.runs) return prev;
                                            const newRuns = [...prev.runs];

                                            // Process all buffered updates
                                            streamBufferRef.current.forEach((text: string, key: string) => {
                                                const [convId, turnIdxStr] = key.split('-');
                                                const turnIdx = parseInt(turnIdxStr);

                                                // Find run
                                                let runIdx = newRuns.findIndex(r => r.conversation_id === convId);

                                                // Fallback strategies
                                                if (runIdx === -1 && data.conversationIndex !== undefined && newRuns[data.conversationIndex]) {
                                                    runIdx = data.conversationIndex;
                                                }
                                                if (runIdx === -1 && convId === 'unknown') runIdx = 0;

                                                if (runIdx !== -1) {
                                                    const run = { ...newRuns[runIdx] };
                                                    if (run.turns && run.turns[turnIdx]) {
                                                        const turn = { ...run.turns[turnIdx] };
                                                        turn.actual = (turn.actual || '') + text;
                                                        run.turns[turnIdx] = turn;
                                                        newRuns[runIdx] = run;
                                                    }
                                                }
                                            });

                                            // Clear buffer after flushing
                                            streamBufferRef.current.clear();
                                            rafIdRef.current = null;
                                            return { ...prev, runs: newRuns };
                                        });
                                    });
                                }
                            }

                            if (data.done && data.result) {
                                console.log("Stream done. Result:", data.result);
                                setRunResults(data.result);
                            }

                            if (data.error) {
                                console.error("Stream error received:", data.error);
                                setRunResults((prev: any) => {
                                    if (!prev || !prev.runs) return prev;
                                    return prev;
                                });
                                alert(`Error during test run: ${data.error}`);
                            }
                        } catch (e) {
                            console.error('JSON parse error', e, line);
                        }
                    }
                }
            }

        } catch (error: any) {
            console.error("Failed to run test suite", error);
            alert(`Run failed: ${error.message}`);
        } finally {
            setIsRunning(false)
        }
    }

    return {
        isRunning,
        runResults,
        setRunResults,
        handleRun,
    }
}
