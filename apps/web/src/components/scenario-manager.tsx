"use client"

import React, { useEffect, useState } from "react"
import { Play, Plus, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScenarioRunner } from "./scenario-runner"
import { apiClient } from "@/lib/api-client"

interface Scenario {
    _id: string
    name: string
    description?: string
    turns: { role: 'user' | 'agent', message?: string }[]
    judge_ids: string[]
}

export function ScenarioManager() {
    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [agentUrl, setAgentUrl] = useState("http://localhost:3001/api/mock-agent") // Default to mock for demo

    useEffect(() => {
        fetchScenarios()
    }, [])

    const fetchScenarios = async () => {
        try {
            const data = await apiClient.get<Scenario[]>("/api/scenarios")
            setScenarios(data)
        } catch (error) {
            console.error("Failed to fetch scenarios", error)
        }
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        try {
            await apiClient.delete(`/api/scenarios/${id}`)
            fetchScenarios()
            if (selectedScenario?._id === id) setSelectedScenario(null)
        } catch (error) {
            console.error("Failed to delete scenario", error)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 h-[600px]">
            {/* Left Column: List */}
            <div className="md:col-span-2 lg:col-span-2 space-y-4 h-full flex flex-col">
                <Card className="h-full border-dashed flex flex-col">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex justify-between items-center">
                            Scenarios
                            <Button size="sm" variant="outline" onClick={() => { setIsCreating(true); setSelectedScenario(null); setIsRunning(false) }}>
                                <Plus className="w-4 h-4 mr-2" /> New
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-2">
                        {scenarios.map(scenario => (
                            <div
                                key={scenario._id}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedScenario?._id === scenario._id ? 'bg-accent border-primary' : 'bg-card hover:bg-accent/50'}`}
                                onClick={() => { setSelectedScenario(scenario); setIsRunning(false); setIsCreating(false) }}
                            >
                                <div className="space-y-1 overflow-hidden">
                                    <div className="font-medium truncate">{scenario.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] h-5">{scenario.turns.length} turns</Badge>
                                        <Badge variant="outline" className="text-[10px] h-5">{scenario.judge_ids.length} judges</Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={(e) => handleDelete(e, scenario._id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Details or Runner */}
            <div className="md:col-span-1 lg:col-span-5 h-full flex flex-col">
                {isCreating ? (
                    <CreateScenarioForm onCancel={() => setIsCreating(false)} onSuccess={() => { setIsCreating(false); fetchScenarios() }} />
                ) : selectedScenario ? (
                    !isRunning ? (
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>{selectedScenario.name}</CardTitle>
                                <CardDescription>{selectedScenario.description || "No description provided."}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 flex-1">
                                <div className="space-y-2">
                                    <Label>Agent URL</Label>
                                    <div className="flex gap-2">
                                        <Input value={agentUrl} onChange={(e) => setAgentUrl(e.target.value)} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">The endpoint where the Agent receives POST requests.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Conversation Preview</Label>
                                    <div className="border rounded-md p-4 space-y-4 max-h-[300px] overflow-y-auto bg-muted/20">
                                        {selectedScenario.turns.map((turn, idx) => (
                                            <div key={idx} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${turn.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    <p className="font-mono text-xs opacity-50 mb-1 uppercase">{turn.role}</p>
                                                    {turn.message || "(Agent writes here)"}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end border-t pt-4">
                                <Button size="lg" onClick={() => setIsRunning(true)}>
                                    <Play className="w-4 h-4 mr-2" /> Run Scenario
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="mb-4">
                                <Button variant="ghost" size="sm" onClick={() => setIsRunning(false)}>← Back to details</Button>
                            </div>
                            <ScenarioRunner scenario={selectedScenario} agentUrl={agentUrl} />
                        </div>
                    )
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a scenario to view details or run.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function CreateScenarioForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const [name, setName] = useState("")
    const [firstMessage, setFirstMessage] = useState("")
    const [judgeId, setJudgeId] = useState("") // Simplified for MVP: select one judge ID

    // Fetch judges for the dropdown
    const [judges, setJudges] = useState<{ _id: string, name: string }[]>([])

    useEffect(() => {
        apiClient.get<{ _id: string, name: string }[]>("/api/judges").then(setJudges).catch(console.error)
    }, [])

    const handleCreate = async () => {
        try {
            await apiClient.post("/api/scenarios", {
                name,
                turns: [{ role: 'user', message: firstMessage }],
                judge_ids: judgeId ? [judgeId] : []
            })
            onSuccess()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Create New Scenario</CardTitle>
                <CardDescription>Define a conversation flow to test your agent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Scenario Name</Label>
                    <Input placeholder="e.g. Refund Happy Path" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>First User Message</Label>
                    <Input placeholder="e.g. I want to return my order" value={firstMessage} onChange={e => setFirstMessage(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Primary Judge (Optional)</Label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={judgeId}
                        onChange={e => setJudgeId(e.target.value)}
                    >
                        <option value="">Select a judge...</option>
                        {judges.map(j => <option key={j._id} value={j._id}>{j.name}</option>)}
                    </select>
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!name || !firstMessage}>Create</Button>
            </CardFooter>
        </Card>
    )
}
