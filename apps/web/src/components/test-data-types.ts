import type React from "react"

export type CreationMethod = 'manual' | 'upload' | 'generate'

export interface SelectionPopover {
    visible: boolean;
    x: number;
    y: number;
    text: string;
    turnIndex: number;
    runId?: string;
    runIndex?: number;
}

export interface ResultsPanelProps {
    selectedDataSet: TestDataSet
    runResults: any
    isRunning: boolean
    inlineComments: InlineComment[]
    selectionPopover: SelectionPopover | null
    popoverComment: string
    suggestedJudges: any[]
    falsePositives: Map<string, any>
    isRefining: boolean
    refinementSuggestions: any[]
    appliedRefinements: Set<string>
    expandedJudgeCriteria: Set<string>
    isGeneratingJudges: boolean
    onSaveAnnotations: () => void
    onGenerateJudgesFromAnnotations: () => void
    onCreateJudgesFromSuggestions: () => void
    onRemoveInlineComment: (id: string) => void
    onSetPopoverComment: (v: string) => void
    onAddInlineComment: (type: 'good' | 'bad') => void
    onDismissPopover: () => void
    onHandleTextSelection: (e: React.MouseEvent, turnIndex: number, runId?: string, runIndex?: number) => void
    onToggleFalsePositive: (runIndex: number, judgeIndex: number, judge: any, run: any) => void
    onClearFalsePositives: () => void
    onRefineGraders: () => void
    onApplyRefinement: (suggestion: any) => void
    onToggleJudgeCriteria: (key: string) => void
}

export interface ConversationEditorProps {
    editingId: string | null
    formName: string
    formDescription: string
    formDomain: string
    formJudgeIds: string[]
    formConversations: Conversation[]
    activeConversationIndex: number
    formTurns: Turn[]
    creationMethod: CreationMethod
    isGenerating: boolean
    generateSingleCount: number
    generateMultiCount: number
    generateTurnsPerMulti: number
    csvContent: string
    previewConversations: Conversation[]
    judges: Judge[]
    domains: Domain[]
    showDomainForm: boolean
    newDomainName: string
    onSetFormName: (v: string) => void
    onSetFormDescription: (v: string) => void
    onSetFormDomain: (v: string) => void
    onSetFormConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
    onSetActiveConversationIndex: (v: number) => void
    onSetCreationMethod: (v: CreationMethod) => void
    onSetGenerateSingleCount: (v: number) => void
    onSetGenerateMultiCount: (v: number) => void
    onSetGenerateTurnsPerMulti: (v: number) => void
    onSetCsvContent: (v: string) => void
    onSetPreviewConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
    onSetShowDomainForm: (v: boolean) => void
    onSetNewDomainName: (v: string) => void
    onCreateDomain: () => void
    onSave: () => void
    onCancel: () => void
    onAddTurn: () => void
    onUpdateTurn: (index: number, field: keyof Turn, value: string) => void
    onRemoveTurn: (index: number) => void
    onToggleJudge: (judgeId: string) => void
    onGenerate: () => void
    onParseCSV: () => void
    onAddPreviewToForm: () => void
}

export interface Turn {
    role: 'user' | 'agent'
    message: string
}

export interface Conversation {
    _id?: string
    name: string
    description?: string
    turns: Turn[]
    judge_ids?: string[] // Override suite-level judges
}

export interface TestSuite {
    _id: string
    app_id: string
    domain_id?: string
    name: string
    description?: string
    conversations: Conversation[]
    judge_ids: string[] // Suite-level default judges
    source_type: 'manual' | 'upload' | 'discover'
    // Legacy support
    turns?: Turn[]
}

// Alias for backward compatibility
export type TestDataSet = TestSuite

export interface Domain {
    _id: string
    name: string
    slug: string
}

export interface Judge {
    _id: string
    name: string
}

export interface InlineComment {
    id: string;
    turnIndex: number;
    text: string;
    type: 'good' | 'bad';
    comment: string;
    conversationId?: string; // ID of the specific run/conversation
    conversationIndex?: number; // Fallback if ID not available
}

// Helper functions for backward compatibility with legacy data
export const getTurns = (dataset: TestSuite): Turn[] => {
    // New format: use first conversation's turns
    if (dataset.conversations?.length > 0) {
        return dataset.conversations[0].turns || []
    }
    // Legacy format: use turns directly
    return dataset.turns || []
}

export const getConversationCount = (dataset: TestSuite): number => {
    if (dataset.conversations?.length > 0) {
        return dataset.conversations.length
    }
    // Legacy: treat as single conversation
    return dataset.turns?.length ? 1 : 0
}
