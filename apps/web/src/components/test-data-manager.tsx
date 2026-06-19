"use client"

import React, { useState } from "react"
import { useApp } from "./app-context"
import { apiClient } from "@/lib/api-client"
import { ConversationEditor } from "./conversation-editor"
import { TestSuiteList } from "./test-suite-list"
import { ResultsPanel } from "./results-panel"
import { useTestData } from "@/hooks/useTestData"
import { useTestRunner } from "@/hooks/useTestRunner"
import { useAnnotations } from "@/hooks/useAnnotations"

export function TestDataManager() {
    const { currentApp, currentEnvironment } = useApp()
    const [selectedDomain, setSelectedDomain] = useState<string>("all")

    // Expandable judge criteria state
    const [expandedJudgeCriteria, setExpandedJudgeCriteria] = useState<Set<string>>(new Set())

    // False Positive Refinement State
    const [falsePositives, setFalsePositives] = useState<Map<string, any>>(new Map())
    const [isRefining, setIsRefining] = useState(false)
    const [refinementSuggestions, setRefinementSuggestions] = useState<any[]>([])
    const [appliedRefinements, setAppliedRefinements] = useState<Set<string>>(new Set())

    const { isRunning, runResults, setRunResults, handleRun } = useTestRunner(currentApp, currentEnvironment)

    const testData = useTestData(currentApp, currentEnvironment, selectedDomain, setRunResults)

    const annotations = useAnnotations(
        currentApp,
        runResults,
        testData.setFormJudgeIds,
        testData.fetchJudges
    )

    const toggleFalsePositive = (runIndex: number, judgeIndex: number, judge: any, run: any) => {
        const key = `${runIndex}-${judgeIndex}`
        setFalsePositives(prev => {
            const next = new Map(prev)
            if (next.has(key)) {
                next.delete(key)
            } else {
                let excerpt = judge.citation || "";
                if (!excerpt && run.turns && run.turns.length > 0) {
                    const lastAgentTurn = [...run.turns].reverse().find((t: any) => t.role === 'agent');
                    if (lastAgentTurn) excerpt = lastAgentTurn.actual;
                }
                next.set(key, {
                    judgeId: judge.judge_id,
                    judgeName: judge.judge_name,
                    reasoning: judge.reasoning,
                    citation: judge.citation,
                    conversationExcerpt: excerpt
                })
            }
            return next
        })
    }

    const handleRefineGraders = async () => {
        if (!currentApp) return;
        setIsRefining(true);
        try {
            const payload = Array.from(falsePositives.values());
            const data = await apiClient.post<{ suggestions?: any[] }>(`/api/apps/${currentApp._id}/refine-judges`, { falsePositives: payload });
            if (data.suggestions) {
                setRefinementSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error("Failed to refine graders:", error);
        } finally {
            setIsRefining(false);
        }
    }

    const handleApplyRefinement = async (suggestion: any) => {
        if (!currentApp) return;
        try {
            await apiClient.put(`/api/judges/${suggestion.judge_id}`, {
                criteria: suggestion.suggested_criteria
            });
            setAppliedRefinements(prev => new Set(prev).add(suggestion.judge_id));
        } catch (error) {
            console.error("Failed to apply refinement:", error);
        }
    }

    const toggleJudgeCriteria = (key: string) => {
        setExpandedJudgeCriteria(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const handleViewRun = (suiteRun: any) => {
        testData.viewRun(
            suiteRun,
            annotations.setInlineComments,
            annotations.setSuggestedJudges,
            setFalsePositives
        )
    }

    if (!currentApp) {
        return (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Select an app to manage test data.
            </div>
        )
    }

    // Show creation/edit form
    if (testData.isCreating) {
        return (
            <ConversationEditor
                editingId={testData.editingId}
                formName={testData.formName}
                formDescription={testData.formDescription}
                formDomain={testData.formDomain}
                formJudgeIds={testData.formJudgeIds}
                formConversations={testData.formConversations}
                activeConversationIndex={testData.activeConversationIndex}
                formTurns={testData.formTurns}
                creationMethod={testData.creationMethod}
                isGenerating={testData.isGenerating}
                generateSingleCount={testData.generateSingleCount}
                generateMultiCount={testData.generateMultiCount}
                generateTurnsPerMulti={testData.generateTurnsPerMulti}
                csvContent={testData.csvContent}
                previewConversations={testData.previewConversations}
                judges={testData.judges}
                domains={testData.domains}
                showDomainForm={testData.showDomainForm}
                newDomainName={testData.newDomainName}
                onSetFormName={testData.setFormName}
                onSetFormDescription={testData.setFormDescription}
                onSetFormDomain={testData.setFormDomain}
                onSetFormConversations={testData.setFormConversations}
                onSetActiveConversationIndex={testData.setActiveConversationIndex}
                onSetCreationMethod={testData.setCreationMethod}
                onSetGenerateSingleCount={testData.setGenerateSingleCount}
                onSetGenerateMultiCount={testData.setGenerateMultiCount}
                onSetGenerateTurnsPerMulti={testData.setGenerateTurnsPerMulti}
                onSetCsvContent={testData.setCsvContent}
                onSetPreviewConversations={testData.setPreviewConversations}
                onSetShowDomainForm={testData.setShowDomainForm}
                onSetNewDomainName={testData.setNewDomainName}
                onCreateDomain={testData.createDomain}
                onSave={testData.handleSave}
                onCancel={testData.resetForm}
                onAddTurn={testData.addTurn}
                onUpdateTurn={testData.updateTurn}
                onRemoveTurn={testData.removeTurn}
                onToggleJudge={testData.toggleJudge}
                onGenerate={testData.handleGenerate}
                onParseCSV={testData.handleParseCSV}
                onAddPreviewToForm={testData.addPreviewToForm}
            />
        )
    }

    // Main list view
    return (
        <div className="space-y-6">
            <TestSuiteList
                testDataSets={testData.testDataSets}
                domains={testData.domains}
                judges={testData.judges}
                selectedDomain={selectedDomain}
                selectedDataSet={testData.selectedDataSet}
                isLoading={testData.isLoading}
                isRunning={isRunning}
                showRunHistory={testData.showRunHistory}
                runHistory={testData.runHistory}
                onSetSelectedDomain={setSelectedDomain}
                onSetIsCreating={testData.setIsCreating}
                onEditDataSet={testData.handleEdit}
                onDeleteDataSet={testData.handleDelete}
                onRunDataSet={(dataset) => handleRun(dataset, testData.setSelectedDataSet)}
                onShowRunHistory={() => { testData.fetchRunHistory(); testData.setShowRunHistory(true) }}
                onHideRunHistory={() => testData.setShowRunHistory(false)}
                onViewRun={handleViewRun}
            />

            {runResults && testData.selectedDataSet && (
                <ResultsPanel
                    selectedDataSet={testData.selectedDataSet}
                    runResults={runResults}
                    isRunning={isRunning}
                    inlineComments={annotations.inlineComments}
                    selectionPopover={annotations.selectionPopover}
                    popoverComment={annotations.popoverComment}
                    suggestedJudges={annotations.suggestedJudges}
                    falsePositives={falsePositives}
                    isRefining={isRefining}
                    refinementSuggestions={refinementSuggestions}
                    appliedRefinements={appliedRefinements}
                    expandedJudgeCriteria={expandedJudgeCriteria}
                    isGeneratingJudges={annotations.isGeneratingJudges}
                    onSaveAnnotations={annotations.saveAnnotations}
                    onGenerateJudgesFromAnnotations={annotations.generateJudgesFromAnnotations}
                    onCreateJudgesFromSuggestions={annotations.createJudgesFromSuggestions}
                    onRemoveInlineComment={annotations.removeInlineComment}
                    onSetPopoverComment={annotations.setPopoverComment}
                    onAddInlineComment={annotations.addInlineComment}
                    onDismissPopover={() => { annotations.setSelectionPopover(null); window.getSelection()?.removeAllRanges() }}
                    onHandleTextSelection={annotations.handleTextSelection}
                    onToggleFalsePositive={toggleFalsePositive}
                    onClearFalsePositives={() => setFalsePositives(new Map())}
                    onRefineGraders={handleRefineGraders}
                    onApplyRefinement={handleApplyRefinement}
                    onToggleJudgeCriteria={toggleJudgeCriteria}
                />
            )}
        </div>
    )
}
