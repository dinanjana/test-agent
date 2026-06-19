"use client"

import React, { useEffect, useState } from "react"
import { Plus, Trash2, Wifi, WifiOff, Loader2, CheckCircle2, XCircle, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"

interface Agent {
    _id: string
    name: string
    description?: string
    endpoint_url: string
    auth_type: 'none' | 'bearer' | 'api_key'
    auth_token?: string
    api_key_header?: string
    response_path?: string
    last_tested_at?: string
    last_test_status?: 'success' | 'failed'
    last_test_latency_ms?: number
    active: boolean
}

interface TestResult {
    success: boolean
    latency_ms: number
    response?: any
    error?: string
}

export function AgentConnector() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [isTesting, setIsTesting] = useState<string | null>(null)
    const [testResult, setTestResult] = useState<TestResult | null>(null)

    // Form State
    const [name, setName] = useState("")
    const [endpointUrl, setEndpointUrl] = useState("")
    const [authType, setAuthType] = useState<'none' | 'bearer' | 'api_key'>("none")
    const [authToken, setAuthToken] = useState("")
    const [apiKeyHeader, setApiKeyHeader] = useState("X-API-Key")
    const [responsePath, setResponsePath] = useState("response")

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        try {
            const data = await apiClient.get<Agent[]>("/api/agents")
            setAgents(data)
        } catch (error) {
            console.error("Failed to fetch agents", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async () => {
        setIsCreating(true)
        setTestResult(null)
        try {
            await apiClient.post("/api/agents", {
                name,
                endpoint_url: endpointUrl,
                auth_type: authType,
                auth_token: authToken || undefined,
                api_key_header: authType === 'api_key' ? apiKeyHeader : undefined,
                response_path: responsePath
            })
            resetForm()
            fetchAgents()
        } catch (error) {
            console.error("Failed to create agent", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await apiClient.delete(`/api/agents/${id}`)
            fetchAgents()
        } catch (error) {
            console.error("Failed to delete agent", error)
        }
    }

    const handleTestConnection = async (id: string) => {
        setIsTesting(id)
        setTestResult(null)
        try {
            const data = await apiClient.post<TestResult>(`/api/agents/${id}/test`)
            setTestResult(data)
            fetchAgents() // Refresh to get updated test status
        } catch (error) {
            console.error("Failed to test connection", error)
            setTestResult({ success: false, latency_ms: 0, error: "Request failed" })
        } finally {
            setIsTesting(null)
        }
    }

    const resetForm = () => {
        setName("")
        setEndpointUrl("")
        setAuthType("none")
        setAuthToken("")
        setApiKeyHeader("X-API-Key")
        setResponsePath("response")
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Left Column: Agent List */}
            <div className="md:col-span-2 lg:col-span-2 space-y-4">
                <Card className="h-full border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wifi className="w-5 h-5" />
                            Connected Agents
                        </CardTitle>
                        <CardDescription>
                            {agents.length} agent{agents.length !== 1 ? 's' : ''} configured
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {agents.map(agent => (
                            <div key={agent._id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium flex items-center gap-2">
                                        {agent.name}
                                        {agent.last_test_status === 'success' ? (
                                            <Badge variant="outline" className="text-[10px] h-5 text-green-500 border-green-500/50">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Connected
                                            </Badge>
                                        ) : agent.last_test_status === 'failed' ? (
                                            <Badge variant="outline" className="text-[10px] h-5 text-red-500 border-red-500/50">
                                                <XCircle className="w-3 h-3 mr-1" />
                                                Failed
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
                                                Not tested
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground truncate mb-2">
                                    {agent.endpoint_url}
                                </p>
                                {agent.last_test_latency_ms && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        {agent.last_test_latency_ms}ms latency
                                    </p>
                                )}
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-8"
                                        onClick={() => handleTestConnection(agent._id)}
                                        disabled={isTesting === agent._id}
                                    >
                                        {isTesting === agent._id ? (
                                            <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Testing...</>
                                        ) : (
                                            <>Test</>
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(agent._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {agents.length === 0 && !isLoading && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                <WifiOff className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                No agents connected yet.
                                <br />
                                Add your first agent to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Connection Form */}
            <div className="md:col-span-1 lg:col-span-5">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Connect Your Agent</CardTitle>
                        <CardDescription>
                            Add a new AI agent endpoint to test. TestAgent will send prompts and evaluate responses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Agent Name *</Label>
                            <Input
                                placeholder="e.g. Customer Support Bot"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Endpoint URL *</Label>
                            <Input
                                placeholder="https://api.mycompany.com/agent"
                                value={endpointUrl}
                                onChange={(e) => setEndpointUrl(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                The endpoint should accept POST requests with a JSON body containing a "message" field.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Authentication</Label>
                                <Select value={authType} onValueChange={(v: 'none' | 'bearer' | 'api_key') => setAuthType(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">🔓 None</SelectItem>
                                        <SelectItem value="bearer">🔐 Bearer Token</SelectItem>
                                        <SelectItem value="api_key">🔑 API Key Header</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Response Path</Label>
                                <Input
                                    placeholder="response"
                                    value={responsePath}
                                    onChange={(e) => setResponsePath(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    JSON path to agent response (e.g. data.response)
                                </p>
                            </div>
                        </div>

                        {authType !== 'none' && (
                            <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                                {authType === 'api_key' && (
                                    <div className="space-y-2">
                                        <Label>Header Name</Label>
                                        <Input
                                            placeholder="X-API-Key"
                                            value={apiKeyHeader}
                                            onChange={(e) => setApiKeyHeader(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>{authType === 'bearer' ? 'Bearer Token' : 'API Key'}</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••••••"
                                        value={authToken}
                                        onChange={(e) => setAuthToken(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Test Result Display */}
                        {testResult && (
                            <div className={`p-4 rounded-lg border ${testResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {testResult.success ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                    <span className="font-medium">
                                        {testResult.success ? 'Connection Successful!' : 'Connection Failed'}
                                    </span>
                                    <span className="text-sm text-muted-foreground ml-auto">
                                        {testResult.latency_ms}ms
                                    </span>
                                </div>
                                {testResult.error && (
                                    <p className="text-sm text-red-500">{testResult.error}</p>
                                )}
                                {testResult.response && (
                                    <pre className="mt-2 text-xs bg-background/50 p-2 rounded overflow-auto max-h-32">
                                        {JSON.stringify(testResult.response, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button variant="outline" onClick={resetForm}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={!name || !endpointUrl || isCreating}>
                            {isCreating ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            ) : (
                                <><Plus className="w-4 h-4 mr-2" /> Add Agent</>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
