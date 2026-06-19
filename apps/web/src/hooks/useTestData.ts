"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { App, Environment } from "@/lib/types"
import {
    Turn,
    Conversation,
    TestDataSet,
    Domain,
    Judge,
    CreationMethod,
} from "@/components/test-data-types"

export function useTestData(
    currentApp: App | null,
    currentEnvironment: Environment | null,
    selectedDomain: string,
    setRunResults: (results: any) => void
) {
    const [testDataSets, setTestDataSets] = useState<TestDataSet[]>([])
    const [domains, setDomains] = useState<Domain[]>([])
    const [judges, setJudges] = useState<Judge[]>([])
    const [selectedDataSet, setSelectedDataSet] = useState<TestDataSet | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Domain creation
    const [showDomainForm, setShowDomainForm] = useState(false)
    const [newDomainName, setNewDomainName] = useState("")

    // Form state
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formName, setFormName] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formDomain, setFormDomain] = useState<string>("")
    const [formJudgeIds, setFormJudgeIds] = useState<string[]>([])

    // Multi-conversation state
    const [formConversations, setFormConversations] = useState<Conversation[]>([
        { name: "Conversation 1", turns: [{ role: 'user', message: '' }] }
    ])
    const [activeConversationIndex, setActiveConversationIndex] = useState(0)

    // Derived state for current conversation's turns
    const formTurns = formConversations[activeConversationIndex]?.turns || []
    const setFormTurns = (turns: Turn[] | ((prev: Turn[]) => Turn[])) => {
        setFormConversations(prev => {
            const updated = [...prev]
            updated[activeConversationIndex] = {
                ...updated[activeConversationIndex],
                turns: typeof turns === 'function' ? turns(updated[activeConversationIndex].turns) : turns
            }
            return updated
        })
    }

    // Synthetic data generation state
    const [creationMethod, setCreationMethod] = useState<CreationMethod>('manual')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generateSingleCount, setGenerateSingleCount] = useState(5)
    const [generateMultiCount, setGenerateMultiCount] = useState(2)
    const [generateTurnsPerMulti, setGenerateTurnsPerMulti] = useState(3)
    const [csvContent, setCsvContent] = useState("")
    const [previewConversations, setPreviewConversations] = useState<Conversation[]>([])

    // Run history state
    const [showRunHistory, setShowRunHistory] = useState(false)
    const [runHistory, setRunHistory] = useState<any[]>([])

    useEffect(() => {
        if (currentApp) {
            fetchTestData()
            fetchDomains()
            fetchJudges()
        }
    }, [currentApp, selectedDomain])

    const fetchTestData = async () => {
        if (!currentApp) return
        setIsLoading(true)
        try {
            const path = selectedDomain && selectedDomain !== "all"
                ? `/api/apps/${currentApp._id}/test-data?domain_id=${selectedDomain}`
                : `/api/apps/${currentApp._id}/test-data`
            const data = await apiClient.get<TestDataSet[]>(path)
            setTestDataSets(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch test data", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchDomains = async () => {
        if (!currentApp) return
        try {
            const data = await apiClient.get<Domain[]>(`/api/apps/${currentApp._id}/domains`)
            setDomains(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch domains", error)
        }
    }

    const fetchJudges = async () => {
        if (!currentApp) return
        try {
            const data = await apiClient.get<Judge[]>("/api/judges")
            const filtered = Array.isArray(data)
                ? data.filter((j: any) => !j.app_id || j.app_id === currentApp._id)
                : []
            setJudges(filtered)
        } catch (error) {
            console.error("Failed to fetch judges", error)
        }
    }

    const createDomain = async () => {
        if (!currentApp || !newDomainName.trim()) return
        try {
            await apiClient.post(`/api/apps/${currentApp._id}/domains`, { name: newDomainName })
            setNewDomainName("")
            setShowDomainForm(false)
            fetchDomains()
        } catch (error) {
            console.error("Failed to create domain", error)
        }
    }

    const handleSave = async () => {
        if (!currentApp || !formName.trim()) return

        try {
            const conversations = formConversations.map(conv => ({
                ...conv,
                turns: conv.turns.filter(t => t.message.trim())
            })).filter(conv => conv.turns.length > 0)

            const body = {
                name: formName,
                description: formDescription || undefined,
                domain_id: formDomain || undefined,
                conversations: conversations.length > 0 ? conversations : [{ name: "Conversation 1", turns: [] }],
                judge_ids: formJudgeIds
            }

            if (editingId) {
                await apiClient.put(`/api/apps/${currentApp._id}/test-data/${editingId}`, body)
            } else {
                await apiClient.post(`/api/apps/${currentApp._id}/test-data`, body)
            }
            resetForm()
            fetchTestData()
        } catch (error) {
            console.error("Failed to save test suite", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!currentApp) return
        try {
            await apiClient.delete(`/api/apps/${currentApp._id}/test-data/${id}`)
            fetchTestData()
            if (selectedDataSet?._id === id) setSelectedDataSet(null)
        } catch (error) {
            console.error("Failed to delete test data", error)
        }
    }

    const handleEdit = (dataset: TestDataSet) => {
        setEditingId(dataset._id)
        setFormName(dataset.name)
        setFormDescription(dataset.description || "")
        setFormDomain(dataset.domain_id || "")

        if (dataset.conversations?.length > 0) {
            setFormConversations(dataset.conversations)
        } else {
            const turns = dataset.turns || []
            setFormConversations([{
                name: "Conversation 1",
                turns: turns.length > 0 ? turns : [{ role: 'user', message: '' }]
            }])
        }
        setActiveConversationIndex(0)
        setFormJudgeIds(dataset.judge_ids || [])
        setIsCreating(true)
        setSelectedDataSet(null)
    }

    const resetForm = () => {
        setFormName("")
        setFormDescription("")
        setFormDomain("")
        setFormConversations([{ name: "Conversation 1", turns: [{ role: 'user', message: '' }] }])
        setActiveConversationIndex(0)
        setFormJudgeIds([])
        setEditingId(null)
        setIsCreating(false)
        setCreationMethod('manual')
        setPreviewConversations([])
        setCsvContent("")
    }

    const addTurn = () => {
        const lastRole = formTurns[formTurns.length - 1]?.role || 'agent'
        setFormTurns([...formTurns, { role: lastRole === 'user' ? 'agent' : 'user', message: '' }])
    }

    const updateTurn = (index: number, field: keyof Turn, value: string) => {
        const newTurns = [...formTurns]
        newTurns[index] = { ...newTurns[index], [field]: value }
        setFormTurns(newTurns)
    }

    const removeTurn = (index: number) => {
        setFormTurns(formTurns.filter((_, i) => i !== index))
    }

    const toggleJudge = (judgeId: string) => {
        setFormJudgeIds(prev =>
            prev.includes(judgeId)
                ? prev.filter(id => id !== judgeId)
                : [...prev, judgeId]
        )
    }

    const handleGenerate = async () => {
        if (!currentApp) return
        setIsGenerating(true)

        const existingQuestions: string[] = []
        testDataSets.forEach(ds => {
            const turns = ds.conversations?.length > 0 ? ds.conversations[0].turns || [] : ds.turns || []
            turns.forEach((t: Turn) => {
                if (t.role === 'user' && t.message.trim()) {
                    existingQuestions.push(t.message.trim())
                }
            })
        })
        formConversations.forEach(conv => {
            conv.turns.forEach(t => {
                if (t.role === 'user' && t.message.trim()) {
                    existingQuestions.push(t.message.trim())
                }
            })
        })

        try {
            const data = await apiClient.post<{ conversations?: Conversation[]; error?: string }>(`/api/apps/${currentApp._id}/generate-conversations`, {
                suiteName: formName || "Test Suite",
                suiteDescription: formDescription,
                singleTurnCount: generateSingleCount,
                multiTurnCount: generateMultiCount,
                turnsPerMulti: generateTurnsPerMulti,
                existingQuestions: existingQuestions.slice(0, 50)
            })
            if (data.conversations) {
                setPreviewConversations(data.conversations)
            }
            if (data.error) {
                alert(data.error)
            }
        } catch (error) {
            console.error("Failed to generate conversations", error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleParseCSV = async () => {
        if (!currentApp || !csvContent.trim()) return
        try {
            const data = await apiClient.post<{ conversations?: Conversation[] }>(`/api/apps/${currentApp._id}/parse-csv`, { csvContent })
            if (data.conversations) {
                setPreviewConversations(data.conversations)
            }
        } catch (error) {
            console.error("Failed to parse CSV", error)
        }
    }

    const addPreviewToForm = () => {
        if (previewConversations.length === 0) return
        setFormConversations(prev => [...prev, ...previewConversations])
        setPreviewConversations([])
        setCreationMethod('manual')
    }

    const loadRunHistory = async () => {
        if (!currentApp || !selectedDataSet) return
        try {
            const data = await apiClient.get<{ runs: any[] }>(`/api/apps/${currentApp._id}/runs?test_data_id=${selectedDataSet._id}&limit=10`)
            setRunHistory(data.runs)
        } catch (error) {
            console.error("Failed to load run history:", error)
        }
    }

    const fetchRunHistory = async () => {
        if (!currentApp) return
        try {
            const data = await apiClient.get<{ runs: any[] }>(`/api/apps/${currentApp._id}/runs?group_by_suite=true`)
            setRunHistory(Array.isArray(data.runs) ? data.runs : [])
        } catch (error) {
            console.error("Failed to fetch run history", error)
        }
    }

    useEffect(() => {
        if (showRunHistory && selectedDataSet) {
            loadRunHistory()
        }
    }, [showRunHistory, currentApp, selectedDataSet])

    const viewRun = async (suiteRun: any, setInlineComments: (comments: any[]) => void, setSuggestedJudges: (judges: any[]) => void, setFalsePositives: (fp: Map<string, any>) => void) => {
        const dataset = testDataSets.find(d => d._id === suiteRun.test_data_id) || {
            _id: suiteRun.test_data_id,
            name: suiteRun.test_data_name,
            app_id: currentApp!._id,
            conversations: [],
            judge_ids: [],
            source_type: 'manual'
        } as any;

        setSelectedDataSet(dataset)
        setRunResults(suiteRun)

        const allComments: any[] = []
        if (suiteRun.runs) {
            suiteRun.runs.forEach((run: any) => {
                if (run.annotations) {
                    run.annotations.forEach((a: any) => {
                        allComments.push({
                            id: a.id || crypto.randomUUID(),
                            turnIndex: a.response_index || 0,
                            text: a.highlighted_text || '',
                            type: a.passed ? 'good' : 'bad',
                            comment: a.explanation || '',
                            conversationId: run.conversation_id || run._id
                        })
                    })
                }
            })
        }
        setInlineComments(allComments)

        setSuggestedJudges([])
        setShowRunHistory(false)
        setFalsePositives(new Map())
    }

    return {
        testDataSets,
        domains,
        judges,
        selectedDataSet,
        setSelectedDataSet,
        isLoading,
        showDomainForm,
        setShowDomainForm,
        newDomainName,
        setNewDomainName,
        isCreating,
        setIsCreating,
        editingId,
        formName,
        setFormName,
        formDescription,
        setFormDescription,
        formDomain,
        setFormDomain,
        formJudgeIds,
        setFormJudgeIds,
        formConversations,
        setFormConversations,
        activeConversationIndex,
        setActiveConversationIndex,
        formTurns,
        creationMethod,
        setCreationMethod,
        isGenerating,
        generateSingleCount,
        setGenerateSingleCount,
        generateMultiCount,
        setGenerateMultiCount,
        generateTurnsPerMulti,
        setGenerateTurnsPerMulti,
        csvContent,
        setCsvContent,
        previewConversations,
        setPreviewConversations,
        showRunHistory,
        setShowRunHistory,
        runHistory,
        fetchTestData,
        fetchDomains,
        fetchJudges,
        createDomain,
        handleSave,
        handleDelete,
        handleEdit,
        resetForm,
        addTurn,
        updateTurn,
        removeTurn,
        toggleJudge,
        handleGenerate,
        handleParseCSV,
        addPreviewToForm,
        loadRunHistory,
        fetchRunHistory,
        viewRun,
    }
}
