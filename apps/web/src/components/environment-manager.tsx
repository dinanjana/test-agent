"use client"

import React, { useEffect, useState } from "react"
import { Plus, Trash2, Loader2, CheckCircle2, XCircle, Circle, Pencil, TestTube, ChevronDown, ChevronRight, Copy, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useApp } from "./app-context"
import { apiClient } from "@/lib/api-client"

function flattenJsonPaths(obj: Record<string, any>, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([key, val]) => {
        const path = prefix ? `${prefix}.${key}` : key
        return typeof val === 'object' && val !== null && !Array.isArray(val)
            ? flattenJsonPaths(val, path)
            : [path]
    })
}

interface Environment {
    _id: string
    app_id: string
    name: string
    slug: string
    endpoint_url: string
    auth_type: 'none' | 'bearer' | 'api_key'
    auth_token?: string
    color: string
    is_default: boolean
    last_test_status?: 'success' | 'failed'
    last_test_latency_ms?: number
}

export function EnvironmentManager() {
    const { currentApp, environments, refreshEnvironments } = useApp()
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [testingId, setTestingId] = useState<string | null>(null)
    const [testResult, setTestResult] = useState<{ success: boolean; latency_ms: number; error?: string; response?: Record<string, any> } | null>(null)
    const [testingEnvId, setTestingEnvId] = useState<string | null>(null)
    const [fieldsExpanded, setFieldsExpanded] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    // Form state
    const [name, setName] = useState("")
    const [endpointUrl, setEndpointUrl] = useState("")
    const [authType, setAuthType] = useState<'none' | 'bearer' | 'api_key'>("none")
    const [authToken, setAuthToken] = useState("")
    const [color, setColor] = useState("#3B82F6")

    const colors = [
        { value: "#3B82F6", label: "Blue" },
        { value: "#10B981", label: "Green" },
        { value: "#F59E0B", label: "Amber" },
        { value: "#EF4444", label: "Red" },
        { value: "#8B5CF6", label: "Purple" },
    ]

    const resetForm = () => {
        setName("")
        setEndpointUrl("")
        setAuthType("none")
        setAuthToken("")
        setColor("#3B82F6")
        setEditingId(null)
    }

    const handleSave = async () => {
        if (!currentApp || !name.trim()) return
        setIsCreating(true)

        try {
            const body = {
                name,
                endpoint_url: endpointUrl,
                auth_type: authType,
                auth_token: authToken || undefined,
                color
            }
            if (editingId) {
                await apiClient.put(`/api/apps/${currentApp._id}/environments/${editingId}`, body)
            } else {
                await apiClient.post(`/api/apps/${currentApp._id}/environments`, body)
            }
            resetForm()
            await refreshEnvironments()
        } catch (error) {
            console.error("Failed to save environment", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleEdit = (env: any) => {
        setEditingId(env._id)
        setName(env.name)
        setEndpointUrl(env.endpoint_url || "")
        setAuthType(env.auth_type || "none")
        setAuthToken(env.auth_token || "")
        setColor(env.color || "#3B82F6")
    }

    const handleTest = async (envId: string) => {
        if (!currentApp) return
        setTestingId(envId)
        setTestingEnvId(envId)
        setTestResult(null)
        setFieldsExpanded(false)

        try {
            const data = await apiClient.post<{ success: boolean; latency_ms: number; error?: string; response?: Record<string, any> }>(`/api/apps/${currentApp._id}/environments/${envId}/test`)
            setTestResult(data)
            if (data.success && data.response) {
                setFieldsExpanded(true)
            }
            await refreshEnvironments()
        } catch (error) {
            setTestResult({ success: false, latency_ms: 0, error: "Request failed" })
        } finally {
            setTestingId(null)
        }
    }

    const handleCopyField = (fieldPath: string) => {
        const snippet = `{{response.${fieldPath}}}`
        navigator.clipboard.writeText(snippet).catch(() => {})
        setCopiedField(fieldPath)
        setTimeout(() => setCopiedField(null), 1500)
    }

    const handleDelete = async (envId: string) => {
        if (!currentApp) return
        try {
            await apiClient.delete(`/api/apps/${currentApp._id}/environments/${envId}`)
            await refreshEnvironments()
        } catch (error) {
            console.error("Failed to delete environment", error)
        }
    }

    if (!currentApp) return null

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Environment List */}
            <Card>
                <CardHeader>
                    <CardTitle>Environments</CardTitle>
                    <CardDescription>
                        Configure endpoints for different deployment stages
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {environments.map((env) => (
                        <div
                            key={env._id}
                            className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: env.color }}
                                    />
                                    <span className="font-medium">{env.name}</span>
                                    {env.is_default && (
                                        <Badge variant="secondary" className="text-xs">Default</Badge>
                                    )}
                                    {env.last_test_status === 'success' && (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                    {env.last_test_status === 'failed' && (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleEdit(env)}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleTest(env._id)}
                                        disabled={testingId === env._id || !env.endpoint_url}
                                    >
                                        {testingId === env._id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <TestTube className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                                {env.endpoint_url || "No endpoint configured"}
                            </p>
                            {env.last_test_latency_ms && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Last test: {env.last_test_latency_ms}ms
                                </p>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Add/Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Environment" : "Add Environment"}</CardTitle>
                    <CardDescription>
                        {editingId ? "Update environment configuration" : "Add a new deployment environment"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                                placeholder="e.g. Production"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <Select value={color} onValueChange={setColor}>
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {colors.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.value }} />
                                                {c.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Endpoint URL</Label>
                        <Input
                            placeholder="https://api.mycompany.com/agent"
                            value={endpointUrl}
                            onChange={(e) => setEndpointUrl(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Authentication</Label>
                        <Select value={authType} onValueChange={(v: 'none' | 'bearer' | 'api_key') => setAuthType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="bearer">Bearer Token</SelectItem>
                                <SelectItem value="api_key">API Key</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {authType !== 'none' && (
                        <div className="space-y-2">
                            <Label>{authType === 'bearer' ? 'Bearer Token' : 'API Key'}</Label>
                            <Input
                                type="password"
                                placeholder="••••••••••••"
                                value={authToken}
                                onChange={(e) => setAuthToken(e.target.value)}
                            />
                        </div>
                    )}

                    {testResult && (
                        <div className="space-y-2">
                            <div className={`p-3 rounded-lg text-sm ${testResult.success ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                {testResult.success ? (
                                    <>✓ Connected successfully ({testResult.latency_ms}ms)</>
                                ) : (
                                    <>✗ {testResult.error || 'Connection failed'}</>
                                )}
                            </div>
                            {testResult.success && testResult.response && typeof testResult.response === 'object' && (
                                <div className="border rounded-lg text-sm overflow-hidden">
                                    <button
                                        type="button"
                                        className="w-full flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted text-left font-medium text-xs"
                                        onClick={() => setFieldsExpanded(v => !v)}
                                    >
                                        {fieldsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                        Response Fields (click to copy)
                                    </button>
                                    {fieldsExpanded && (
                                        <div className="p-3 flex flex-wrap gap-1.5">
                                            {flattenJsonPaths(testResult.response).map(field => (
                                                <button
                                                    key={field}
                                                    type="button"
                                                    onClick={() => handleCopyField(field)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono transition-colors"
                                                    title={`Copy {{response.${field}}}`}
                                                >
                                                    {copiedField === field ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                    {field}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="gap-2">
                    {editingId && (
                        <Button variant="outline" onClick={resetForm}>Cancel</Button>
                    )}
                    <Button onClick={handleSave} disabled={!name.trim() || isCreating} className="flex-1">
                        {isCreating ? "Saving..." : editingId ? "Update" : "Add Environment"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
