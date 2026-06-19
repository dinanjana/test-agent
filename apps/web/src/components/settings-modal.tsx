"use client"

import React, { useEffect, useState } from "react"
import { Settings, Key, Eye, EyeOff, Save, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useApp } from "./app-context"
import { apiClient } from "@/lib/api-client"

const PROVIDERS = {
    openai: {
        name: 'OpenAI',
        models: [
            { id: 'gpt-4o', name: 'GPT-4o (Best)' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast)' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Budget)' },
        ],
        keyPrefix: 'sk-'
    },
    anthropic: {
        name: 'Anthropic',
        models: [
            { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Best)' },
            { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Fast)' },
        ],
        keyPrefix: 'sk-ant-'
    },
    google: {
        name: 'Google AI',
        models: [
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Fast)' },
        ],
        keyPrefix: 'AI'
    }
}

interface ProviderConfig {
    has_key: boolean
    masked_key?: string
    default_model?: string
}

interface LLMSettings {
    openai?: ProviderConfig
    anthropic?: ProviderConfig
    google?: ProviderConfig
}

export function SettingsModal() {
    const { currentApp } = useApp()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Settings state
    const [settings, setSettings] = useState<LLMSettings>({})

    // Form state for each provider
    const [openaiKey, setOpenaiKey] = useState("")
    const [openaiModel, setOpenaiModel] = useState("gpt-4o-mini")
    const [anthropicKey, setAnthropicKey] = useState("")
    const [anthropicModel, setAnthropicModel] = useState("claude-3-5-sonnet-20241022")
    const [googleKey, setGoogleKey] = useState("")
    const [googleModel, setGoogleModel] = useState("gemini-1.5-flash")

    // Show/hide toggles
    const [showOpenai, setShowOpenai] = useState(false)
    const [showAnthropic, setShowAnthropic] = useState(false)
    const [showGoogle, setShowGoogle] = useState(false)

    useEffect(() => {
        if (open && currentApp) {
            fetchSettings()
        }
    }, [open, currentApp])

    const fetchSettings = async () => {
        if (!currentApp) return
        setLoading(true)
        try {
            const data = await apiClient.get<LLMSettings>(`/api/apps/${currentApp._id}/settings`)
            setSettings(data)

            // Pre-fill default models from saved settings
            if (data.openai?.default_model) setOpenaiModel(data.openai.default_model)
            if (data.anthropic?.default_model) setAnthropicModel(data.anthropic.default_model)
            if (data.google?.default_model) setGoogleModel(data.google.default_model)
        } catch (error) {
            console.error('Failed to fetch settings', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!currentApp) return
        setSaving(true)
        try {
            const body: any = {}

            // Only include providers that have new keys or model changes
            if (openaiKey || openaiModel !== 'gpt-4o-mini') {
                body.openai = {
                    ...(openaiKey ? { api_key: openaiKey } : {}),
                    default_model: openaiModel
                }
            }
            if (anthropicKey || anthropicModel !== 'claude-3-5-sonnet-20241022') {
                body.anthropic = {
                    ...(anthropicKey ? { api_key: anthropicKey } : {}),
                    default_model: anthropicModel
                }
            }
            if (googleKey || googleModel !== 'gemini-1.5-flash') {
                body.google = {
                    ...(googleKey ? { api_key: googleKey } : {}),
                    default_model: googleModel
                }
            }

            await apiClient.put(`/api/apps/${currentApp._id}/settings`, body)

            // Clear entered keys and refresh
            setOpenaiKey("")
            setAnthropicKey("")
            setGoogleKey("")
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
            fetchSettings()
        } catch (error) {
            console.error('Failed to save settings', error)
        } finally {
            setSaving(false)
        }
    }

    const configuredCount = [
        settings.openai?.has_key,
        settings.anthropic?.has_key,
        settings.google?.has_key
    ].filter(Boolean).length

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                    {configuredCount > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                            {configuredCount} LLM{configuredCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>App Settings</DialogTitle>
                    <DialogDescription>
                        Configure LLM providers for judge evaluations. API keys are stored securely and never exposed.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 flex-1 overflow-y-auto">
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            LLM Providers
                        </h3>

                        {/* OpenAI */}
                        <Card className={settings.openai?.has_key ? "border-green-500/50" : ""}>
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">OpenAI</CardTitle>
                                    {settings.openai?.has_key && (
                                        <Badge variant="outline" className="text-green-500 text-xs">
                                            ✓ Configured
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 pt-0 space-y-2">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            type={showOpenai ? "text" : "password"}
                                            placeholder={settings.openai?.masked_key || "sk-..."}
                                            value={openaiKey}
                                            onChange={(e) => setOpenaiKey(e.target.value)}
                                            className="pr-10 font-mono text-sm"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                            onClick={() => setShowOpenai(!showOpenai)}
                                        >
                                            {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <Select value={openaiModel} onValueChange={setOpenaiModel}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROVIDERS.openai.models.map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Anthropic */}
                        <Card className={settings.anthropic?.has_key ? "border-green-500/50" : ""}>
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Anthropic</CardTitle>
                                    {settings.anthropic?.has_key && (
                                        <Badge variant="outline" className="text-green-500 text-xs">
                                            ✓ Configured
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 pt-0 space-y-2">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            type={showAnthropic ? "text" : "password"}
                                            placeholder={settings.anthropic?.masked_key || "sk-ant-..."}
                                            value={anthropicKey}
                                            onChange={(e) => setAnthropicKey(e.target.value)}
                                            className="pr-10 font-mono text-sm"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                            onClick={() => setShowAnthropic(!showAnthropic)}
                                        >
                                            {showAnthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <Select value={anthropicModel} onValueChange={setAnthropicModel}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROVIDERS.anthropic.models.map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Google */}
                        <Card className={settings.google?.has_key ? "border-green-500/50" : ""}>
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Google AI</CardTitle>
                                    {settings.google?.has_key && (
                                        <Badge variant="outline" className="text-green-500 text-xs">
                                            ✓ Configured
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 pt-0 space-y-2">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            type={showGoogle ? "text" : "password"}
                                            placeholder={settings.google?.masked_key || "AI..."}
                                            value={googleKey}
                                            onChange={(e) => setGoogleKey(e.target.value)}
                                            className="pr-10 font-mono text-sm"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                            onClick={() => setShowGoogle(!showGoogle)}
                                        >
                                            {showGoogle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <Select value={googleModel} onValueChange={setGoogleModel}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROVIDERS.google.models.map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        💡 Each judge can select which model to use. Configure at least one provider to enable judge evaluations.
                    </p>

                    {/* Integrations Section */}
                    <div className="space-y-3 pt-4 border-t">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            🔗 Integrations
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Connect Jira or Linear to create tickets from failed test runs.
                        </p>

                        {/* Linear */}
                        <Card>
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Linear</CardTitle>
                                    <IntegrationStatus appId={currentApp?._id} provider="linear" />
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 pt-0">
                                <LinearConnect appId={currentApp?._id} />
                            </CardContent>
                        </Card>

                        {/* Jira */}
                        <Card>
                            <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Jira</CardTitle>
                                    <IntegrationStatus appId={currentApp?._id} provider="jira" />
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 pt-0">
                                <JiraConnect appId={currentApp?._id} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saved ? (
                            <><Check className="w-4 h-4 mr-2" /> Saved</>
                        ) : saving ? (
                            "Saving..."
                        ) : (
                            <><Save className="w-4 h-4 mr-2" /> Save Settings</>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Hook to get available models based on configured providers
export function useAvailableModels() {
    const { currentApp } = useApp()
    const [availableModels, setAvailableModels] = useState<{ provider: string, model: string, name: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (currentApp) {
            fetchAvailableModels()
        }
    }, [currentApp])

    const fetchAvailableModels = async () => {
        if (!currentApp) return
        try {
            const settings = await apiClient.get<LLMSettings>(`/api/apps/${currentApp._id}/settings`)

            const models: { provider: string, model: string, name: string }[] = []

            if (settings.openai?.has_key) {
                PROVIDERS.openai.models.forEach(m => {
                    models.push({ provider: 'openai', model: m.id, name: `OpenAI ${m.name}` })
                })
            }
            if (settings.anthropic?.has_key) {
                PROVIDERS.anthropic.models.forEach(m => {
                    models.push({ provider: 'anthropic', model: m.id, name: `Anthropic ${m.name}` })
                })
            }
            if (settings.google?.has_key) {
                PROVIDERS.google.models.forEach(m => {
                    models.push({ provider: 'google', model: m.id, name: `Google ${m.name}` })
                })
            }

            setAvailableModels(models)
        } catch (error) {
            console.error('Failed to fetch available models', error)
        } finally {
            setLoading(false)
        }
    }

    return { availableModels, loading, refetch: fetchAvailableModels }
}

// Integration status badge
function IntegrationStatus({ appId, provider }: { appId?: string, provider: 'jira' | 'linear' }) {
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        if (appId) {
            apiClient.get<Record<string, { connected: boolean }>>(`/api/apps/${appId}/integrations/status`)
                .then(data => setConnected(data[provider]?.connected || false))
                .catch(() => { })
        }
    }, [appId, provider])

    return connected ? (
        <Badge variant="outline" className="text-green-500 text-xs">✓ Connected</Badge>
    ) : null
}

// Linear connect form
function LinearConnect({ appId }: { appId?: string }) {
    const [apiKey, setApiKey] = useState("")
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)

    const handleConnect = async () => {
        if (!appId || !apiKey) return
        setConnecting(true)
        try {
            const data = await apiClient.post<{ success: boolean, error?: string }>(`/api/apps/${appId}/integrations/linear/connect`, { api_key: apiKey })
            if (data.success) {
                setConnected(true)
                setApiKey("")
            } else {
                alert(data.error || 'Failed to connect')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setConnecting(false)
        }
    }

    if (connected) {
        return <p className="text-sm text-green-500">✓ Linear connected successfully!</p>
    }

    return (
        <div className="flex gap-2">
            <Input
                type="password"
                placeholder="lin_api_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 font-mono text-sm"
            />
            <Button size="sm" onClick={handleConnect} disabled={connecting || !apiKey}>
                {connecting ? 'Connecting...' : 'Connect'}
            </Button>
        </div>
    )
}

// Jira connect form
function JiraConnect({ appId }: { appId?: string }) {
    const [email, setEmail] = useState("")
    const [apiToken, setApiToken] = useState("")
    const [domain, setDomain] = useState("")
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)

    const handleConnect = async () => {
        if (!appId || !email || !apiToken || !domain) return
        setConnecting(true)
        try {
            const data = await apiClient.post<{ success: boolean, error?: string }>(`/api/apps/${appId}/integrations/jira/connect`, { email, api_token: apiToken, domain })
            if (data.success) {
                setConnected(true)
            } else {
                alert(data.error || 'Failed to connect')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setConnecting(false)
        }
    }

    if (connected) {
        return <p className="text-sm text-green-500">✓ Jira connected successfully!</p>
    }

    return (
        <div className="space-y-2">
            <Input
                placeholder="your-domain (e.g. mycompany)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="text-sm"
            />
            <Input
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm"
            />
            <div className="flex gap-2">
                <Input
                    type="password"
                    placeholder="API Token"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    className="flex-1 text-sm"
                />
                <Button size="sm" onClick={handleConnect} disabled={connecting || !email || !apiToken || !domain}>
                    {connecting ? 'Connecting...' : 'Connect'}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Get your API token from <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" className="underline">Atlassian Account Settings</a>
            </p>
        </div>
    )
}
