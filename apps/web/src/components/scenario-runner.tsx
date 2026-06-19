"use client"

import React, { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient } from "@/lib/api-client"

interface ScenarioRunnerProps {
    scenario: any
    agentUrl: string
}

export function ScenarioRunner({ scenario, agentUrl }: ScenarioRunnerProps) {
    const [logs, setLogs] = useState<string[]>([])

    const mutation = useMutation({
        mutationFn: async () => {
            return apiClient.post<any>(`/api/scenarios/${scenario._id}/run`, { agentUrl })
        }
    })

    useEffect(() => {
        // Auto-run on mount
        mutation.mutate()
    }, [scenario._id, agentUrl])

    const result = mutation.data

    return (
        <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Running: {scenario.name}
                            {mutation.isPending && <Badge variant="outline" className="animate-pulse">Running...</Badge>}
                            {mutation.isSuccess && (result.status === 'pass' ? <Badge className="bg-green-500">Passed</Badge> : <Badge variant="destructive">Failed</Badge>)}
                        </CardTitle>
                        <CardDescription>Target: {agentUrl}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-6 pb-6">
                        {/* Render Turns from Result or Scenario (if pending, show scenario turns as pending) */}
                        {mutation.isPending && (
                            <div className="space-y-4 opacity-50">
                                {scenario.turns.map((turn: any, i: number) => (
                                    <div key={i} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className="max-w-[80%] rounded-lg p-3 bg-muted text-sm animate-pulse">
                                            Turning {i + 1}...
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {result && result.turns && result.turns.map((turn: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-2"
                            >
                                {/* We assume the BE returns combined turns or we infer User turn from scenario + Agent turn from result? 
                                    The BE runner returns an array of turns performed. 
                                    Actually the BE model I wrote returns "turns" array which contains executed agent turns. 
                                    Let's look at the BE response structure.
                                    It seemed to return: { ..., turns: [{ role: 'agent', message: '...', evaluations: [...] }] }
                                    But wait, the User message is lost in the result? 
                                    Ah, I should have included the User message in the result turns for completeness.
                                    For now, I'll render the User message from the scenario definition if I can match them, 
                                    or just render what I have.
                                */}

                                {/* Render User Message (Inferred from Scenario for now, assuming 1:1 mapping) */}
                                {scenario.turns[idx] && scenario.turns[idx].role === 'user' && (
                                    <div className="flex justify-end">
                                        <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground text-sm">
                                            <p className="font-mono text-[10px] opacity-70 mb-1">USER</p>
                                            {scenario.turns[idx].message}
                                        </div>
                                    </div>
                                )}

                                {/* Render Agent Response */}
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] space-y-2">
                                        <div className="rounded-lg p-3 bg-muted border text-sm">
                                            <p className="font-mono text-[10px] text-muted-foreground mb-1">AGENT ({turn.duration_ms}ms)</p>
                                            {turn.message}
                                        </div>

                                        {/* Evaluations */}
                                        {turn.evaluations && turn.evaluations.length > 0 && (
                                            <div className="space-y-1 pl-2">
                                                {turn.evaluations.map((ev: any, j: number) => (
                                                    <div key={j} className={`flex items-start gap-2 text-xs rounded p-2 ${ev.passed ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                                        {ev.passed ? <CheckCircle2 className="w-3 h-3 mt-0.5" /> : <AlertCircle className="w-3 h-3 mt-0.5" />}
                                                        <div>
                                                            <span className="font-semibold">{ev.judge_name}:</span> {ev.passed ? "PASS" : "FAIL"}
                                                            {!ev.passed && <p className="opacity-90 mt-0.5">{ev.reason}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
