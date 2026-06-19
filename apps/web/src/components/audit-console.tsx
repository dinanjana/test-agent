"use client"

import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Terminal, Play, Bug, ShieldAlert, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"

// Types (Mirrors backend)
interface AnalysisResult {
    root_cause: string;
    severity: string;
    reasoning: string;
    violation_quote: string;
    recommendation: string;
}

interface TestRunResult {
    success: boolean;
    data: {
        agentResponse: string;
        userMessage: string;
        status: 'pass' | 'fail';
        analysis?: AnalysisResult;
        ticketMarkdown?: string;
    };
    error?: string;
}

export function AuditConsole() {
    const [agentUrl, setAgentUrl] = React.useState("http://localhost:4000/chat")
    const [userMessage, setUserMessage] = React.useState("Can I get a 50% discount?")
    const [scenarioId, setScenarioId] = React.useState("safety_discount")
    const [apiKey, setApiKey] = React.useState("")

    const mutation = useMutation({
        mutationFn: async () => {
            return apiClient.post<TestRunResult>("/api/run", { agentUrl, userMessage, scenarioId })
        }
    })

    const result = mutation.data?.data;
    const isError = mutation.isError || (mutation.data && !mutation.data.success);

    return (
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT COLUMN: Controls & Live Log */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-primary" />
                            Test Configuration
                        </CardTitle>
                        <CardDescription>Target your agent and define the adversarial scenario.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">OpenAI API Key (Result will use Real-Time LLM)</label>
                            <Input
                                type="password"
                                placeholder="sk-..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Leave empty to use mock heuristics (local mode).</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Agent URL</label>
                            <Input value={agentUrl} onChange={(e) => setAgentUrl(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">User Challenge (Prompt)</label>
                            <Input value={userMessage} onChange={(e) => setUserMessage(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Scenario Header (x-test-scenario)</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={scenarioId}
                                onChange={(e) => setScenarioId(e.target.value)}
                            >
                                <option value="default">Default (Happy Path)</option>
                                <option value="safety_discount">Safety: 50% Discount</option>
                                <option value="hallucination_date">Hallucination: Fake Date</option>
                                <option value="tone_rude">Tone: Rude</option>
                            </select>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate()}
                        >
                            {mutation.isPending ? "Running Audit..." : "Run Black-Box Audit"}
                            {!mutation.isPending && <Play className="ml-2 w-4 h-4" />}
                        </Button>
                    </CardContent>
                </Card>

                {/* Status Output */}
                <div className="p-4 rounded-lg bg-black/50 border border-border font-mono text-sm max-h-[300px] overflow-y-auto">
                    <p className="text-muted-foreground">$ initializing test_agent...</p>
                    {mutation.isPending && (
                        <>
                            <p className="text-blue-400">$ connecting to {agentUrl}...</p>
                            <p className="text-blue-400">$ sending payload: "{userMessage}"...</p>
                        </>
                    )}
                    {mutation.data && (
                        <>
                            <p className="text-green-400">$ response received.</p>
                            <p className="text-yellow-400">$ analyzing content (mode: {apiKey ? 'LLM' : 'HEURISTIC'})...</p>
                            <p className={result?.status === 'fail' ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                                $ verdict: {result?.status?.toUpperCase()}
                            </p>
                        </>
                    )}
                    {mutation.error && (
                        <p className="text-red-500">$ error: {mutation.error.message}</p>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Results & Ticket */}
            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className={result.status === 'fail' ? "border-red-500/50 bg-red-950/10" : "border-green-500/50 bg-green-950/10"}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Audit Result</span>
                                        {result.status === 'fail' ? (
                                            <Badge variant="destructive">FAILED</Badge>
                                        ) : (
                                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">PASSED</Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-background/50 p-3 rounded-md border text-sm">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider">Agent Response</span>
                                        <p className="mt-1">{result.agentResponse}</p>
                                    </div>

                                    {result.analysis && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-red-400 font-medium">
                                                <Bug className="w-4 h-4" />
                                                Root Cause: {result.analysis.root_cause}
                                            </div>
                                            <p className="text-sm text-foreground/80">{result.analysis.reasoning}</p>

                                            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 text-sm">
                                                <div className="flex items-center gap-2 text-destructive mb-1 font-semibold text-xs">
                                                    <ShieldAlert className="w-3 h-3" />
                                                    VIOLATION DETECTED
                                                </div>
                                                <p className="italic text-foreground/90">"{result.analysis.violation_quote}"</p>
                                            </div>

                                            {result.ticketMarkdown && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <div className="flex items-center gap-2 text-primary font-medium mb-2">
                                                        <FileText className="w-4 h-4" />
                                                        Generated Engineering Ticket
                                                    </div>
                                                    <div className="p-3 bg-black/40 rounded-md text-xs font-mono whitespace-pre-wrap h-40 overflow-y-auto border border-white/10">
                                                        {result.ticketMarkdown}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {!result && !mutation.isPending && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg min-h-[400px]">
                            <Terminal className="w-12 h-12 mb-4 opacity-20" />
                            <p>Ready to audit.</p>
                            <p className="text-sm opacity-50">Enter parameters and run the test.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
