"use client"

import { useState } from "react"
import React from "react"
import { apiClient } from "@/lib/api-client"
import { App } from "@/lib/types"
import { InlineComment } from "@/components/test-data-types"

export function useAnnotations(
    currentApp: App | null,
    runResults: any,
    setFormJudgeIds?: (updater: (prev: string[]) => string[]) => void,
    fetchJudges?: () => Promise<void>
) {
    const [inlineComments, setInlineComments] = useState<InlineComment[]>([])
    const [selectionPopover, setSelectionPopover] = useState<{
        visible: boolean;
        x: number;
        y: number;
        text: string;
        turnIndex: number;
        runId?: string;
        runIndex?: number;
    } | null>(null)
    const [popoverComment, setPopoverComment] = useState("")
    const [isGeneratingJudges, setIsGeneratingJudges] = useState(false)
    const [suggestedJudges, setSuggestedJudges] = useState<any[]>([])

    const handleTextSelection = (e: React.MouseEvent, turnIndex: number, runId?: string, runIndex?: number) => {
        const selection = window.getSelection()
        const selectedText = selection?.toString().trim()
        if (selectedText && selectedText.length > 0) {
            const rect = selection?.getRangeAt(0).getBoundingClientRect()
            if (rect) {
                setSelectionPopover({
                    visible: true,
                    x: rect.left + rect.width / 2,
                    y: rect.bottom + 10,
                    text: selectedText,
                    turnIndex,
                    runId,
                    runIndex
                })
                setPopoverComment("")
            }
        }
    }

    const addInlineComment = (type: 'good' | 'bad') => {
        if (!selectionPopover) return
        const newComment: InlineComment = {
            id: crypto.randomUUID(),
            turnIndex: selectionPopover.turnIndex,
            text: selectionPopover.text,
            type,
            comment: popoverComment,
            conversationId: selectionPopover.runId,
            conversationIndex: selectionPopover.runIndex
        }
        setInlineComments(prev => [...prev, newComment])
        setSelectionPopover(null)
        setPopoverComment("")
        window.getSelection()?.removeAllRanges()
    }

    const removeInlineComment = (id: string) => {
        setInlineComments(prev => prev.filter(c => c.id !== id))
    }

    const saveAnnotations = async () => {
        if (!currentApp || !runResults) return

        const commentsByRun = new Map<string, InlineComment[]>();
        inlineComments.forEach(c => {
            const runId = c.conversationId;
            if (runId) {
                if (!commentsByRun.has(runId)) commentsByRun.set(runId, []);
                commentsByRun.get(runId)!.push(c);
            }
        });

        try {
            await Promise.all(Array.from(commentsByRun.entries()).map(async ([runId, comments]) => {
                const annotations = comments.map(c => ({
                    id: c.id,
                    conversation_index: 0,
                    response_index: c.turnIndex,
                    passed: c.type === 'good',
                    explanation: c.comment,
                    highlighted_text: c.text
                }))
                await apiClient.post(`/api/apps/${currentApp._id}/runs/${runId}/annotations`, { annotations })
            }));
            alert("Annotations saved!")
        } catch (error) {
            console.error("Failed to save annotations", error)
        }
    }

    const generateJudgesFromAnnotations = async () => {
        if (!currentApp || !runResults) return

        const badComments = inlineComments.filter(c => c.type === 'bad');
        if (badComments.length === 0) {
            alert("Mark some responses as 'Bad' with comments to generate judges.")
            return
        }

        setIsGeneratingJudges(true)
        try {
            const commentsByRun = new Map<string, InlineComment[]>();
            badComments.forEach(c => {
                const runId = c.conversationId;
                if (runId) {
                    if (!commentsByRun.has(runId)) commentsByRun.set(runId, []);
                    commentsByRun.get(runId)!.push(c);
                }
            });

            const allSuggestions: any[] = [];

            await Promise.all(Array.from(commentsByRun.entries()).map(async ([runId, comments]) => {
                const annotations = comments.map(c => ({
                    passed: false,
                    explanation: c.comment,
                    highlighted_text: c.text
                }))

                const data = await apiClient.post<{ judges?: any[] }>(`/api/apps/${currentApp._id}/generate-judges-from-annotations`, { runId, annotations })
                if (data.judges) {
                    allSuggestions.push(...data.judges)
                }
            }));

            if (allSuggestions.length > 0) {
                setSuggestedJudges(prev => [...prev, ...allSuggestions])
            }
        } catch (error) {
            console.error("Failed to generate judges", error)
        } finally {
            setIsGeneratingJudges(false)
        }
    }

    const createJudgesFromSuggestions = async () => {
        if (!currentApp || suggestedJudges.length === 0) return
        try {
            const data = await apiClient.post<{ judges?: any[] }>(`/api/apps/${currentApp._id}/create-judges-from-suggestions`, { judges: suggestedJudges })

            if (data.judges && Array.isArray(data.judges)) {
                const newIds = data.judges.map((j: any) => j._id).filter(Boolean)
                if (newIds.length > 0 && setFormJudgeIds) {
                    setFormJudgeIds(prev => Array.from(new Set([...prev, ...newIds])))
                }
            }

            alert("Judges created and attached to this suite! Check the Define tab to manage them.")
            setSuggestedJudges([])
            if (fetchJudges) {
                fetchJudges()
            }
        } catch (error: any) {
            console.error("Failed to create judges", error)
            alert(`Error creating judges: ${error.message}`)
        }
    }

    return {
        inlineComments,
        setInlineComments,
        selectionPopover,
        setSelectionPopover,
        popoverComment,
        setPopoverComment,
        isGeneratingJudges,
        suggestedJudges,
        setSuggestedJudges,
        handleTextSelection,
        addInlineComment,
        removeInlineComment,
        saveAnnotations,
        generateJudgesFromAnnotations,
        createJudgesFromSuggestions,
    }
}
