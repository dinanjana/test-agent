"use client"

import React, { useEffect, useState } from "react"
import { Key, Eye, EyeOff, Save, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'google'
    apiKey: string
    model: string
}

const PROVIDERS = {
    openai: {
        name: 'OpenAI',
        models: [
            { id: 'gpt-4o', name: 'GPT-4o (Recommended)' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Faster)' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Budget)' },
        ],
        keyPrefix: 'sk-'
    },
    anthropic: {
        name: 'Anthropic',
        models: [
            { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Recommended)' },
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

const STORAGE_KEY = 'testagent_llm_config'

export function useLLMConfig() {
    const [config, setConfig] = useState<LLMConfig>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                try {
                    return JSON.parse(saved)
                } catch { }
            }
        }
        return { provider: 'openai', apiKey: '', model: 'gpt-4o-mini' }
    })

    const saveConfig = (newConfig: LLMConfig) => {
        setConfig(newConfig)
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
        }
    }

    return { config, saveConfig }
}

export function LLMSettings() {
    const { config, saveConfig } = useLLMConfig()
    const [provider, setProvider] = useState<'openai' | 'anthropic' | 'google'>(config.provider)
    const [apiKey, setApiKey] = useState(config.apiKey)
    const [model, setModel] = useState(config.model)
    const [showApiKey, setShowApiKey] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        // Update model when provider changes
        const providerModels = PROVIDERS[provider].models
        if (!providerModels.find(m => m.id === model)) {
            setModel(providerModels[0].id)
        }
    }, [provider])

    const handleSave = () => {
        saveConfig({ provider, apiKey, model })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const providerInfo = PROVIDERS[provider]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    LLM Configuration
                </CardTitle>
                <CardDescription>
                    Configure your AI provider and model for running judge evaluations.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>AI Provider</Label>
                        <Select value={provider} onValueChange={(v: 'openai' | 'anthropic' | 'google') => setProvider(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(PROVIDERS).map(([key, p]) => (
                                    <SelectItem key={key} value={key}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Model</Label>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {providerInfo.models.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Input
                                type={showApiKey ? "text" : "password"}
                                placeholder={`${providerInfo.keyPrefix}...`}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="pr-10 font-mono text-sm"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setShowApiKey(!showApiKey)}
                            >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                        <Button onClick={handleSave} disabled={!apiKey}>
                            {saved ? <><Check className="w-4 h-4 mr-2" /> Saved</> : <><Save className="w-4 h-4 mr-2" /> Save</>}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                </div>

                {apiKey && (
                    <div className="flex items-center gap-2 pt-2">
                        <Badge variant="outline" className="text-green-500 border-green-500">
                            ✓ {providerInfo.name} configured
                        </Badge>
                        <Badge variant="secondary">{model}</Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
