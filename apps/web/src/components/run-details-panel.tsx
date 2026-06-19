"use client"

import React, { useEffect, useState } from "react"
import { X, CheckCircle2, XCircle, AlertTriangle, ThumbsUp, ThumbsDown, User, Bot, TicketIcon, ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "./app-context"
import { ViolationHighlight } from "./violation-highlight"
import ReactMarkdown from "react-markdown"
import { apiClient } from "@/lib/api-client"

interface RunDetailsPanelProps {
    runId: string | null
    onClose: () => void
}

export function RunDetailsPanel({ runId, onClose }: RunDetailsPanelProps) {
    const { currentApp } = useApp()
    const [run, setRun] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [creatingTicket, setCreatingTicket] = useState(false)
    const [ticketResult, setTicketResult] = useState<{ provider: string, url: string } | null>(null)
    const [integrations, setIntegrations] = useState<{ jira: boolean, linear: boolean }>({ jira: false, linear: false })
    const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (runId && currentApp?._id) {
            fetchRunDetails()
            fetchIntegrationStatus()
        }
    }, [runId, currentApp?._id])

    const fetchRunDetails = async () => {
        if (!runId || !currentApp?._id) return
        setLoading(true)
        try {
            const data = await apiClient.get<any>(`/api/apps/${currentApp._id}/runs/${runId}`)
            setRun(data)
        } catch (error) {
            console.error('Failed to fetch run details:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchIntegrationStatus = async () => {
        if (!currentApp?._id) return
        try {
            const data = await apiClient.get<{ jira?: { connected: boolean }, linear?: { connected: boolean } }>(`/api/apps/${currentApp._id}/integrations/status`)
            setIntegrations({ jira: data.jira?.connected ?? false, linear: data.linear?.connected ?? false })
        } catch (error) {
            console.error('Failed to fetch integration status:', error)
        }
    }

    const createTicket = async (provider: 'jira' | 'linear') => {
        if (!runId || !currentApp?._id) return
        setCreatingTicket(true)
        try {
            const data = await apiClient.post<{ success: boolean, error?: string, issue?: { url: string } }>(`/api/apps/${currentApp._id}/tickets`, { runId, provider })
            if (data.success) {
                setTicketResult({ provider, url: data.issue!.url })
            } else {
                alert(data.error || 'Failed to create ticket')
            }
        } catch (error) {
            console.error("Failed to create ticket", error)
        } finally {
            setCreatingTicket(false)
        }
    }

    const submitFeedback = async (judgeId: string, correct: boolean) => {
        if (!runId || !currentApp?._id) return
        try {
            await apiClient.post(`/api/apps/${currentApp._id}/runs/${runId}/feedback`, { judge_id: judgeId, correct })
        } catch (error) {
            console.error("Failed to submit feedback", error)
        }
    }

    if (!runId) return null

    const hasIntegration = integrations.jira || integrations.linear

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">Run Details</CardTitle>
                        {run && (
                            <Badge variant={run.overall_passed ? "outline" : "destructive"}>
                                {run.overall_passed ? "PASSED" : "FAILED"}
                            </Badge>
                        )}
                        {/* Create Ticket Button for failed runs */}
                        {run && !run.overall_passed && hasIntegration && !ticketResult && (
                            <div className="flex gap-1">
                                {integrations.linear && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => createTicket('linear')}
                                        disabled={creatingTicket}
                                        className="text-xs"
                                    >
                                        <TicketIcon className="h-3 w-3 mr-1" />
                                        Linear
                                    </Button>
                                )}
                                {integrations.jira && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => createTicket('jira')}
                                        disabled={creatingTicket}
                                        className="text-xs"
                                    >
                                        <TicketIcon className="h-3 w-3 mr-1" />
                                        Jira
                                    </Button>
                                )}
                            </div>
                        )}
                        {ticketResult && (
                            <a
                                href={ticketResult.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-green-600 hover:underline"
                            >
                                <ExternalLink className="h-3 w-3" />
                                View {ticketResult.provider} ticket
                            </a>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto py-4 space-y-6">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : !run ? (
                        <div className="text-center py-8 text-muted-foreground">Run not found</div>
                    ) : (
                        <>
                            {/* Run Info */}
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{run.test_data_name}</span>
                                <span className="text-muted-foreground">
                                    {run.environment_name} • {run.total_latency_ms}ms • {new Date(run.completed_at).toLocaleString()}
                                </span>
                            </div>

                            {/* Performance Metrics */}
                            {run.metrics && (run.metrics.total_tokens_in || run.metrics.total_tokens_out) && (
                                <div className="flex gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                                    {run.metrics.total_tokens_in && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Tokens In:</span>
                                            <span className="font-medium">{run.metrics.total_tokens_in.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {run.metrics.total_tokens_out && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Tokens Out:</span>
                                            <span className="font-medium">{run.metrics.total_tokens_out.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {run.metrics.estimated_cost && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Est. Cost:</span>
                                            <span className="font-medium text-amber-600">${run.metrics.estimated_cost.toFixed(4)}</span>
                                        </div>
                                    )}
                                    {run.metrics.avg_latency_ms && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Avg Latency:</span>
                                            <span className="font-medium">{run.metrics.avg_latency_ms}ms</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Conversation */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm">Conversation</h4>
                                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                                    {run.turns?.map((turn: any, i: number) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <User className="w-4 h-4 mt-1 text-blue-500" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">User</p>
                                                    <p className="text-sm text-muted-foreground">{turn.input}</p>
                                                </div>
                                            </div>
                                            {turn.actual && (
                                                <div className="flex items-start gap-2 ml-6">
                                                    <Bot className="w-4 h-4 mt-1 text-green-500" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">Agent ({turn.latency_ms}ms)</p>
                                                        <ViolationHighlight
                                                            text={turn.actual}
                                                            violations={run.judge_results
                                                                ?.filter((j: any) => !j.passed && j.citation)
                                                                .map((j: any) => ({
                                                                    citation: j.citation,
                                                                    judgeName: j.judge_name,
                                                                    reasoning: j.reasoning
                                                                })) || []}
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {turn.error && (
                                                <p className="text-sm text-red-500 ml-6">Error: {turn.error}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Judge Results */}
                            {run.judge_results && run.judge_results.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Judge Evaluations</h4>
                                    <div className="space-y-2">
                                        {run.judge_results.map((judge: any, i: number) => {
                                            const criteriaKey = `judge-${i}`
                                            const isCriteriaExpanded = expandedCriteria.has(criteriaKey)
                                            return (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-lg border ${judge.passed
                                                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
                                                    : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-sm">{judge.judge_name}</span>
                                                    <div className="flex items-center gap-2">
                                                        {judge.model && (
                                                            <span className="text-xs text-muted-foreground">{judge.model}</span>
                                                        )}
                                                        <Badge
                                                            variant={judge.passed ? "outline" : "destructive"}
                                                            className={judge.passed ? "text-green-600 border-green-600" : ""}
                                                        >
                                                            {judge.passed ? "PASS" : "FAIL"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {judge.reasoning && (
                                                    <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown>{judge.reasoning}</ReactMarkdown>
                                                    </div>
                                                )}
                                                {judge.citation && (
                                                    <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                                                        Citation: "{judge.citation}"
                                                    </p>
                                                )}
                                                {/* View Prompt toggle */}
                                                <button
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 pt-1 border-t border-current/10 w-full"
                                                    onClick={() => setExpandedCriteria(prev => {
                                                        const next = new Set(prev)
                                                        if (next.has(criteriaKey)) next.delete(criteriaKey)
                                                        else next.add(criteriaKey)
                                                        return next
                                                    })}
                                                >
                                                    {isCriteriaExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                    View Prompt
                                                </button>
                                                {isCriteriaExpanded && (
                                                    <div className="mt-1 p-2 bg-muted/50 rounded text-xs font-mono whitespace-pre-wrap">
                                                        {judge.criteria || "Criteria not available for this run"}
                                                    </div>
                                                )}
                                                {/* Feedback buttons */}
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current/10">
                                                    <span className="text-xs text-muted-foreground">Correct?</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-green-600 hover:bg-green-100"
                                                        onClick={() => submitFeedback(judge.judge_id, true)}
                                                    >
                                                        <ThumbsUp className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
                                                        onClick={() => submitFeedback(judge.judge_id, false)}
                                                    >
                                                        <ThumbsDown className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
