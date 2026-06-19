"use client"

import React from "react"
import { Plus, Trash2, Play, Loader2, User, Bot, FolderOpen, Pencil, History, X, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TestDataSet, Domain, Judge, getTurns, getConversationCount } from "./test-data-types"

interface TestSuiteListProps {
    testDataSets: TestDataSet[]
    domains: Domain[]
    judges: Judge[]
    selectedDomain: string
    selectedDataSet: TestDataSet | null
    isLoading: boolean
    isRunning: boolean
    showRunHistory: boolean
    runHistory: any[]
    onSetSelectedDomain: (v: string) => void
    onSetIsCreating: (v: boolean) => void
    onEditDataSet: (dataset: TestDataSet) => void
    onDeleteDataSet: (id: string) => void
    onRunDataSet: (dataset: TestDataSet) => void
    onShowRunHistory: () => void
    onHideRunHistory: () => void
    onViewRun: (run: any) => void
}

export function TestSuiteList({
    testDataSets,
    domains,
    judges,
    selectedDomain,
    selectedDataSet,
    isLoading,
    isRunning,
    showRunHistory,
    runHistory,
    onSetSelectedDomain,
    onSetIsCreating,
    onEditDataSet,
    onDeleteDataSet,
    onRunDataSet,
    onShowRunHistory,
    onHideRunHistory,
    onViewRun,
}: TestSuiteListProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Simulate</h2>
                    <p className="text-muted-foreground">
                        Run test data sets against your agent and evaluate with judges.
                    </p>
                </div>
                <div className="flex gap-2">
                    {domains.length > 0 && (
                        <Select value={selectedDomain} onValueChange={onSetSelectedDomain}>
                            <SelectTrigger className="w-40">
                                <FolderOpen className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="All domains" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All domains</SelectItem>
                                {domains.map(d => (
                                    <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Button variant="outline" onClick={onShowRunHistory}>
                        <History className="w-4 h-4 mr-2" />Run History
                    </Button>
                    <Button onClick={() => onSetIsCreating(true)}>
                        <Plus className="w-4 h-4 mr-2" /> New Test Data
                    </Button>
                </div>
            </div>

            {/* Run History Panel */}
            {showRunHistory && (
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5" />Run History
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={onHideRunHistory}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {runHistory.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No runs yet. Run a test suite to see history.</p>
                        ) : (
                            runHistory.slice(0, 20).map((run: any) => (
                                <div key={run._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer" onClick={() => onViewRun(run)}>
                                    <div>
                                        <p className="font-medium text-sm">{run.test_data_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(run.completed_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={run.overall_passed ? "outline" : "destructive"} className={run.overall_passed ? "text-green-600 border-green-600" : ""}>
                                            {run.overall_passed ? "PASSED" : "FAILED"}
                                        </Badge>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {testDataSets.map(dataset => (
                    <Card key={dataset._id} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{dataset.name}</CardTitle>
                                    {dataset.description && (
                                        <CardDescription className="mt-1">{dataset.description}</CardDescription>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditDataSet(dataset)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDeleteDataSet(dataset._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="space-y-2">
                                {/* Conversation count indicator */}
                                {getConversationCount(dataset) > 1 && (
                                    <Badge variant="outline" className="text-xs">
                                        {getConversationCount(dataset)} conversations
                                    </Badge>
                                )}
                                {getTurns(dataset).slice(0, 2).map((turn, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        {turn.role === 'user' ? (
                                            <User className="w-4 h-4 mt-0.5 text-blue-500" />
                                        ) : (
                                            <Bot className="w-4 h-4 mt-0.5 text-green-500" />
                                        )}
                                        <span className="text-muted-foreground line-clamp-1">{turn.message}</span>
                                    </div>
                                ))}
                                {getTurns(dataset).length > 2 && (
                                    <p className="text-xs text-muted-foreground">+{getTurns(dataset).length - 2} more turns</p>
                                )}
                            </div>
                            <div className="flex gap-1 mt-3 flex-wrap">
                                {dataset.judge_ids?.slice(0, 3).map(jid => {
                                    const judge = judges.find(j => j._id === jid)
                                    return judge ? (
                                        <Badge key={jid} variant="secondary" className="text-xs">{judge.name}</Badge>
                                    ) : null
                                })}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => onRunDataSet(dataset)}
                                disabled={isRunning}
                            >
                                {isRunning && selectedDataSet?._id === dataset._id ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...</>
                                ) : (
                                    <><Play className="w-4 h-4 mr-2" /> Run Test</>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {testDataSets.length === 0 && !isLoading && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground mb-4">No test data sets yet.</p>
                        <Button onClick={() => onSetIsCreating(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Create your first test
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
