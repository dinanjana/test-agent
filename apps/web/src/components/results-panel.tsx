"use client"

import React from "react"
import { Trash2, Loader2, User, Bot, Sparkles, Check, X, AlertCircle, ChevronDown, ChevronRight, ThumbsDown } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ViolationHighlight } from "./violation-highlight"
import { ResultsPanelProps } from "./test-data-types"

export function ResultsPanel({
    selectedDataSet,
    runResults,
    isRunning,
    inlineComments,
    selectionPopover,
    popoverComment,
    suggestedJudges,
    falsePositives,
    isRefining,
    refinementSuggestions,
    appliedRefinements,
    expandedJudgeCriteria,
    isGeneratingJudges,
    onSaveAnnotations,
    onGenerateJudgesFromAnnotations,
    onCreateJudgesFromSuggestions,
    onRemoveInlineComment,
    onSetPopoverComment,
    onAddInlineComment,
    onDismissPopover,
    onHandleTextSelection,
    onToggleFalsePositive,
    onClearFalsePositives,
    onRefineGraders,
    onApplyRefinement,
    onToggleJudgeCriteria,
}: ResultsPanelProps) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        Run Results: {selectedDataSet.name}
                        {isRunning ? (
                            <Badge className="bg-blue-500 animate-pulse">
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> RUNNING
                            </Badge>
                        ) : runResults.conversations_passed === runResults.conversations_total ? (
                            <Badge className="bg-green-500">PASSED</Badge>
                        ) : (
                            <Badge variant="destructive">
                                {runResults.conversations_passed}/{runResults.conversations_total} PASSED
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onSaveAnnotations}>
                            Save Annotations
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onGenerateJudgesFromAnnotations}
                            disabled={isGeneratingJudges || inlineComments.filter(c => c.type === 'bad').length === 0}
                        >
                            {isGeneratingJudges ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            Generate Judges
                        </Button>
                        <div className="text-sm text-muted-foreground ml-2">
                            {runResults.total_latency_ms}ms total
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Iterate over each conversation run */}
                {runResults.runs?.map((run: any, runIndex: number) => (
                    <div key={runIndex} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                                {run.conversation_name || `Conversation ${runIndex + 1}`}
                                {isRunning && (!run.judge_results || run.judge_results.length === 0) ? (
                                    <Badge variant="outline" className="text-blue-500 border-blue-200">
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> GENERATING
                                    </Badge>
                                ) : run.overall_passed ? (
                                    <Badge className="bg-green-500 text-xs">PASSED</Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-xs">FAILED</Badge>
                                )}
                            </h4>
                            <span className="text-xs text-muted-foreground">{run.total_latency_ms}ms</span>
                        </div>

                        {/* Conversation Turns */}
                        <div className="space-y-2 bg-muted/50 rounded-lg p-3">
                            {run.turns?.filter((t: any) => t.role === 'user').map((turn: any, i: number) => {
                                // Filter comments for this specific conversation (run) and turn
                                const turnComments = inlineComments.filter(c =>
                                    c.turnIndex === i &&
                                    (c.conversationId === run._id || (!c.conversationId && runIndex === 0)) // Fallback for single run
                                )
                                return (
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
                                                    <div onMouseUp={(e) => onHandleTextSelection(e, i, run._id, runIndex)}>
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
                                                    {/* Inline Comments Display */}
                                                    {turnComments.length > 0 && (
                                                        <div className="space-y-2 mt-2">
                                                            {turnComments.map(c => (
                                                                <div key={c.id} className={`flex items-start gap-2 p-2 rounded text-sm border-l-4 ${c.type === 'bad' ? 'bg-red-50 border-red-500 dark:bg-red-950/30 dark:border-red-800' : 'bg-green-50 border-green-500 dark:bg-green-950/30 dark:border-green-800'}`}>
                                                                    <div className="flex-1">
                                                                        <p className={`font-medium ${c.type === 'bad' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                                                                            {c.type === 'bad' ? '✗ Bad' : '✓ Good'}: "{c.text.substring(0, 50)}{c.text.length > 50 ? '...' : ''}"
                                                                        </p>
                                                                        {c.comment && <p className="text-muted-foreground">{c.comment}</p>}
                                                                    </div>
                                                                    <Button variant="ghost" size="sm" onClick={() => onRemoveInlineComment(c.id)}>
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {turn.error && (
                                            <p className="text-sm text-red-500 ml-6">Error: {turn.error}</p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Judge Results for this conversation */}
                        {run.judge_results && run.judge_results.length > 0 && (
                            <div className="space-y-2">
                                <h5 className="font-medium text-xs text-muted-foreground">Judge Evaluations</h5>
                                <div className="space-y-2">
                                    {run.judge_results.map((judge: any, i: number) => {
                                        const criteriaKey = `${runIndex}-${i}`
                                        const isCriteriaExpanded = expandedJudgeCriteria.has(criteriaKey)
                                        return (
                                            <div
                                                key={i}
                                                className={`p-2 rounded-lg border text-sm ${judge.passed
                                                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
                                                    : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{judge.judge_name}</span>
                                                    <Badge
                                                        variant={judge.passed ? "outline" : "destructive"}
                                                        className={judge.passed ? "text-green-600 border-green-600 text-xs" : "text-xs"}
                                                    >
                                                        {judge.passed ? "PASS" : judge.severity === 'warn' ? "WARN" : "FAIL"}
                                                    </Badge>
                                                </div>
                                                {judge.reasoning && (
                                                    <div className="text-xs text-muted-foreground mt-1 prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown>{judge.reasoning}</ReactMarkdown>
                                                    </div>
                                                )}
                                                {/* View Prompt toggle */}
                                                <button
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 pt-1 border-t border-current/10 w-full"
                                                    onClick={() => onToggleJudgeCriteria(criteriaKey)}
                                                >
                                                    {isCriteriaExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                    View Prompt
                                                </button>
                                                {isCriteriaExpanded && (
                                                    <div className="mt-1 p-2 bg-muted/50 rounded text-xs font-mono whitespace-pre-wrap">
                                                        {judge.criteria || "Criteria not available for this run"}
                                                    </div>
                                                )}

                                                {/* False Positive Toggle */}
                                                {!judge.passed && (
                                                    <button
                                                        onClick={() => onToggleFalsePositive(runIndex, i, judge, run)}
                                                        className={`mt-2 w-full text-xs py-1 px-2 rounded border flex items-center justify-center gap-1 transition-colors ${falsePositives.has(criteriaKey)
                                                            ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300"
                                                            : "bg-background border-dashed text-muted-foreground hover:bg-muted"
                                                            }`}
                                                    >
                                                        {falsePositives.has(criteriaKey) ? (
                                                            <>
                                                                <Check className="w-3 h-3" /> Marked as False Positive
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ThumbsDown className="w-3 h-3" /> Mark False Positive
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Global Selection Popover */}
                {selectionPopover?.visible && (
                    <div
                        className="fixed z-50 bg-popover border rounded-lg shadow-lg p-3 space-y-2"
                        style={{ left: selectionPopover.x - 120, top: selectionPopover.y }}
                    >
                        <p className="text-xs text-muted-foreground font-medium">Selected: "{selectionPopover.text.substring(0, 30)}..."</p>
                        <Input
                            placeholder="Add comment (optional)"
                            value={popoverComment}
                            onChange={(e) => onSetPopoverComment(e.target.value)}
                            className="text-sm h-8"
                        />
                        <div className="flex gap-2">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 flex-1" onClick={() => onAddInlineComment('good')}>
                                <Check className="w-3 h-3 mr-1" />Good
                            </Button>
                            <Button size="sm" variant="destructive" className="flex-1" onClick={() => onAddInlineComment('bad')}>
                                <X className="w-3 h-3 mr-1" />Bad
                            </Button>
                            <Button size="sm" variant="ghost" onClick={onDismissPopover}>
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Suggested Judges Preview - at bottom of card */}
                {suggestedJudges.length > 0 && (
                    <div className="space-y-3 pt-4 border-t mt-4">
                        <h4 className="font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-500" />Suggested Judges
                        </h4>
                        {suggestedJudges.map((judge: any, i: number) => (
                            <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                                <p className="font-medium text-sm">{judge.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{judge.criteria}</p>
                                <Badge variant="outline" className="mt-2 text-xs">{judge.severity}</Badge>
                            </div>
                        ))}
                        <Button onClick={onCreateJudgesFromSuggestions} className="w-full">
                            <Check className="w-4 h-4 mr-2" />Create All Judges
                        </Button>
                    </div>
                )}

                {/* Sticky False Positive Toolbar */}
                {falsePositives.size > 0 && (
                    <div className="sticky bottom-4 z-10 mx-auto max-w-2xl bg-popover border shadow-lg rounded-full px-6 py-3 flex items-center justify-between animate-in slide-in-from-bottom-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 rounded-full px-3 py-1 text-xs font-medium">
                                {falsePositives.size} False Positives
                            </div>
                            <span className="text-sm text-muted-foreground hidden sm:inline">
                                Marked for refinement
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClearFalsePositives}
                                className="text-xs text-muted-foreground hover:text-foreground px-3 py-2"
                            >
                                Clear
                            </button>
                            <Button
                                size="sm"
                                onClick={onRefineGraders}
                                disabled={isRefining}
                                className="bg-amber-600 hover:bg-amber-700 text-white border-none"
                            >
                                {isRefining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                Refine Graders
                            </Button>
                        </div>
                    </div>
                )}

                {/* Refinement Suggestions */}
                {refinementSuggestions.length > 0 && (
                    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <h3 className="text-lg font-semibold">Suggested Refinements</h3>
                        </div>

                        <div className="grid gap-4">
                            {refinementSuggestions.map((suggestion, i) => (
                                <Card key={i} className="border-amber-200 dark:border-amber-800">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center justify-between">
                                            <span>{suggestion.judge_name}</span>
                                            {appliedRefinements.has(suggestion.judge_id) && (
                                                <Badge className="bg-green-500">Applied</Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription>{suggestion.explanation}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Current Criteria</span>
                                                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-md font-mono text-xs opacity-70 whitespace-pre-wrap">
                                                    {suggestion.current_criteria}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-xs font-medium text-green-500 uppercase tracking-wider">Suggested Criteria</span>
                                                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-md font-mono text-xs whitespace-pre-wrap">
                                                    {suggestion.suggested_criteria}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end gap-2 pt-0">
                                        {!appliedRefinements.has(suggestion.judge_id) && (
                                            <Button
                                                size="sm"
                                                onClick={() => onApplyRefinement(suggestion)}
                                            >
                                                Apply Refinement
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
