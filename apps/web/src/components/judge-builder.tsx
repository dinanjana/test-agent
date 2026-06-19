"use client"

import React, { useEffect, useRef, useState } from "react"
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle2, Pencil, ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useApp } from "./app-context"
import { apiClient } from "@/lib/api-client"

interface Judge {
    _id: string
    name: string
    criteria: string
    severity: 'fail' | 'warn'
    evaluation_type: 'llm' | 'deterministic' | 'hybrid'
    llm_provider?: string
    llm_model?: string
    active: boolean
    evaluation_count: number
    app_id?: string
}

interface EnvironmentWithFields {
    _id: string
    name: string
    last_test_response?: Record<string, any>
}

function flattenJsonPaths(obj: Record<string, any>, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([key, val]) => {
        const path = prefix ? `${prefix}.${key}` : key
        return typeof val === 'object' && val !== null && !Array.isArray(val)
            ? flattenJsonPaths(val, path)
            : [path]
    })
}

const ALL_MODELS = [
    { provider: 'openai', model: 'gpt-5.2', name: 'OpenAI GPT-5.2' },
    { provider: 'openai', model: 'gpt-5', name: 'OpenAI GPT-5' },
    { provider: 'openai', model: 'gpt-4o', name: 'OpenAI GPT-4o' },
    { provider: 'openai', model: 'gpt-4o-mini', name: 'OpenAI GPT-4o Mini' },
    { provider: 'anthropic', model: 'claude-4-opus', name: 'Claude 4 Opus' },
    { provider: 'anthropic', model: 'claude-4-sonnet', name: 'Claude 4 Sonnet' },
    { provider: 'anthropic', model: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet' },
    { provider: 'google', model: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro' },
    { provider: 'google', model: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { provider: 'google', model: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
]

export function JudgeBuilder() {
    const { currentApp } = useApp()
    const [judges, setJudges] = useState<Judge[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [enabledProviders, setEnabledProviders] = useState<Set<string>>(new Set())
    const [environments, setEnvironments] = useState<EnvironmentWithFields[]>([])
    const [selectedEnvId, setSelectedEnvId] = useState<string>('')
    const [fieldPanelOpen, setFieldPanelOpen] = useState(false)
    const criteriaRef = useRef<HTMLTextAreaElement>(null)

    // Form State
    const [newName, setNewName] = useState("")
    const [newCriteria, setNewCriteria] = useState("")
    const [newSeverity, setNewSeverity] = useState<'fail' | 'warn'>("fail")
    const [newEvalType, setNewEvalType] = useState<'llm' | 'deterministic'>('llm')
    const [newModel, setNewModel] = useState("gpt-4o-mini")
    const [newProvider, setNewProvider] = useState("openai")

    useEffect(() => {
        if (currentApp) {
            fetchJudges()
            fetchSettings()
            fetchEnvironments()
        }
    }, [currentApp])

    const fetchSettings = async () => {
        if (!currentApp) return
        try {
            const settings = await apiClient.get<{ openai?: { has_key: boolean }, anthropic?: { has_key: boolean }, google?: { has_key: boolean } }>(`/api/apps/${currentApp._id}/settings`)
            const enabled = new Set<string>()
            if (settings.openai?.has_key) enabled.add('openai')
            if (settings.anthropic?.has_key) enabled.add('anthropic')
            if (settings.google?.has_key) enabled.add('google')
            setEnabledProviders(enabled)

            // If current selected provider is not enabled, switch to first enabled one
            if (enabled.size > 0 && !enabled.has(newProvider)) {
                const firstEnabled = Array.from(enabled)[0]
                setNewProvider(firstEnabled)
                const model = ALL_MODELS.find(m => m.provider === firstEnabled)?.model
                if (model) setNewModel(model)
            }
        } catch (error) {
            console.error("Failed to fetch settings", error)
        }
    }

    const fetchEnvironments = async () => {
        if (!currentApp) return
        try {
            const data = await apiClient.get<EnvironmentWithFields[]>(`/api/apps/${currentApp._id}/environments`)
            const withFields = data.filter(e => e.last_test_response)
            setEnvironments(withFields)
            if (withFields.length > 0 && !selectedEnvId) {
                setSelectedEnvId(withFields[0]._id)
            }
        } catch (error) {
            console.error("Failed to fetch environments", error)
        }
    }

    const fetchJudges = async () => {
        try {
            const data = await apiClient.get<Judge[]>("/api/judges")
            // Filter by current app if available
            const filtered = currentApp
                ? data.filter((j: Judge) => !j.app_id || j.app_id === currentApp._id)
                : data
            setJudges(filtered)
        } catch (error) {
            console.error("Failed to fetch judges", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setNewName("")
        setNewCriteria("")
        setNewSeverity("fail")
        setNewEvalType("llm")
        setNewModel("gpt-4o-mini")
        setNewProvider("openai")
        setEditingId(null)
    }

    const insertFieldAtCursor = (fieldPath: string) => {
        const el = criteriaRef.current
        if (!el) return
        const insert = `{{response.${fieldPath}}}`
        const start = el.selectionStart ?? newCriteria.length
        const end = el.selectionEnd ?? newCriteria.length
        const updated = newCriteria.slice(0, start) + insert + newCriteria.slice(end)
        setNewCriteria(updated)
        requestAnimationFrame(() => {
            el.focus()
            el.setSelectionRange(start + insert.length, start + insert.length)
        })
    }

    const handleEdit = (judge: Judge) => {
        setEditingId(judge._id)
        setNewName(judge.name)
        setNewCriteria(judge.criteria)
        setNewSeverity(judge.severity)
        setNewEvalType(judge.evaluation_type === 'hybrid' ? 'llm' : judge.evaluation_type)
        setNewModel(judge.llm_model || "gpt-4o-mini")
        setNewProvider(judge.llm_provider || "openai")
    }

    const handleSave = async () => {
        setIsCreating(true)
        try {
            const body = {
                name: newName,
                criteria: newCriteria,
                severity: newSeverity,
                evaluation_type: newEvalType,
                llm_provider: newProvider,
                llm_model: newModel,
                app_id: currentApp?._id
            }
            if (editingId) {
                await apiClient.put(`/api/judges/${editingId}`, body)
            } else {
                await apiClient.post("/api/judges", body)
            }
            resetForm()
            fetchJudges()
        } catch (error) {
            console.error("Failed to save judge", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await apiClient.delete(`/api/judges/${id}`)
            fetchJudges()
            if (editingId === id) resetForm()
        } catch (error) {
            console.error("Failed to delete judge", error)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Left Column: List */}
            <div className="md:col-span-2 lg:col-span-2 space-y-4">
                <Card className="h-full border-dashed">
                    <CardHeader>
                        <CardTitle>Judge Library</CardTitle>
                        <CardDescription>
                            {judges.length} active judges
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {judges.map(judge => (
                            <div
                                key={judge._id}
                                className={`flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer ${editingId === judge._id ? 'ring-2 ring-primary' : ''}`}
                                onClick={() => handleEdit(judge)}
                            >
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="font-medium flex items-center gap-2">
                                        <span className="truncate">{judge.name}</span>
                                        {judge.severity === 'fail' ?
                                            <Badge variant="destructive" className="text-[10px] h-5">Fail</Badge> :
                                            <Badge variant="secondary" className="text-[10px] h-5 text-yellow-500">Warn</Badge>
                                        }
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {judge.criteria}
                                    </p>
                                </div>
                                <div className="flex gap-1 ml-2">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={(e) => { e.stopPropagation(); handleEdit(judge) }}>
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(judge._id) }}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {judges.length === 0 && !isLoading && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No judges defined yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Editor */}
            <div className="md:col-span-1 lg:col-span-5">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Judge" : "Define Evaluation Criteria"}</CardTitle>
                        <CardDescription>
                            {editingId
                                ? "Update the judge configuration below."
                                : "Create a new judge using natural language. The LLM will use this to evaluate agent responses."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Judge Name</Label>
                            <Input
                                placeholder="e.g. Discount Limit Check"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Severity</Label>
                                <Select value={newSeverity} onValueChange={(v: 'fail' | 'warn') => setNewSeverity(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fail">🔴 Fail Test</SelectItem>
                                        <SelectItem value="warn">🟡 Warn Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Evaluation Type</Label>
                                <Select value={newEvalType} onValueChange={(v: 'llm' | 'deterministic') => setNewEvalType(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="llm">🤖 LLM Model</SelectItem>
                                        <SelectItem value="deterministic">📏 Deterministic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {newEvalType === 'llm' && (
                            <div className="space-y-2">
                                <Label>LLM Model</Label>
                                {enabledProviders.size === 0 ? (
                                    <div className="text-sm text-destructive border border-destructive/20 bg-destructive/10 p-2 rounded">
                                        No LLM providers configured. Please add API keys in Settings.
                                    </div>
                                ) : (
                                    <Select
                                        value={`${newProvider}:${newModel}`}
                                        onValueChange={(v) => {
                                            const [provider, model] = v.split(':')
                                            setNewProvider(provider)
                                            setNewModel(model)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ALL_MODELS.filter(m => enabledProviders.has(m.provider)).map(m => (
                                                <SelectItem key={`${m.provider}:${m.model}`} value={`${m.provider}:${m.model}`}>
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Only models from providers with configured API keys are shown.
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Criteria (Instructions for the AI Judge)</Label>
                            <Textarea
                                ref={criteriaRef}
                                className="min-h-[200px] font-mono text-sm resize-none"
                                placeholder="Fail if the agent offers a discount higher than 30%..."
                                value={newCriteria}
                                onChange={(e) => setNewCriteria(e.target.value)}
                            />
                            {environments.length > 0 && (
                                <div className="border rounded-lg text-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-2 bg-muted/50">
                                        <button
                                            type="button"
                                            className="flex items-center gap-1.5 font-medium text-xs hover:text-primary"
                                            onClick={() => setFieldPanelOpen(v => !v)}
                                        >
                                            {fieldPanelOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                            Insert Response Field
                                        </button>
                                        {environments.length > 1 && (
                                            <Select value={selectedEnvId} onValueChange={setSelectedEnvId}>
                                                <SelectTrigger className="h-6 text-xs w-36 border-0 bg-transparent p-0">
                                                    <span className="text-muted-foreground mr-1">Preview from:</span>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {environments.map(e => (
                                                        <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                    {fieldPanelOpen && (() => {
                                        const env = environments.find(e => e._id === selectedEnvId)
                                        const fields = env?.last_test_response ? flattenJsonPaths(env.last_test_response) : []
                                        return (
                                            <div className="p-3 space-y-2">
                                                {fields.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {fields.map(field => (
                                                            <button
                                                                key={field}
                                                                type="button"
                                                                onClick={() => insertFieldAtCursor(field)}
                                                                className="px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono transition-colors"
                                                                title={`Insert {{response.${field}}}`}
                                                            >
                                                                {field}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">No fields found. Test the environment on the Connect page first.</p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    Click a field to insert <code className="font-mono">{'{{response.fieldName}}'}</code> at cursor.
                                                </p>
                                            </div>
                                        )
                                    })()}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Tip: Be specific. Start with "Fail if..." or "Warn if...".
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={!newName || !newCriteria || isCreating}>
                            {isCreating ? "Saving..." : editingId ? "Update Judge" : "Create Judge"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
