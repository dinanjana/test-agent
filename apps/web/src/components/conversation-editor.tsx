"use client"

import React from "react"
import { Plus, Trash2, Loader2, User, Pencil, Upload, Sparkles } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Turn, Conversation, ConversationEditorProps } from "./test-data-types"

export function ConversationEditor({
    editingId,
    formName,
    formDescription,
    formDomain,
    formJudgeIds,
    formConversations,
    activeConversationIndex,
    formTurns,
    creationMethod,
    isGenerating,
    generateSingleCount,
    generateMultiCount,
    generateTurnsPerMulti,
    csvContent,
    previewConversations,
    judges,
    domains,
    showDomainForm,
    newDomainName,
    onSetFormName,
    onSetFormDescription,
    onSetFormDomain,
    onSetFormConversations,
    onSetActiveConversationIndex,
    onSetCreationMethod,
    onSetGenerateSingleCount,
    onSetGenerateMultiCount,
    onSetGenerateTurnsPerMulti,
    onSetCsvContent,
    onSetPreviewConversations,
    onSetShowDomainForm,
    onSetNewDomainName,
    onCreateDomain,
    onSave,
    onCancel,
    onAddTurn,
    onUpdateTurn,
    onRemoveTurn,
    onToggleJudge,
    onGenerate,
    onParseCSV,
    onAddPreviewToForm,
}: ConversationEditorProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{editingId ? "Edit Test Data" : "Create Test Data"}</h2>
                    <p className="text-muted-foreground">Define a multi-turn conversation to test your agent.</p>
                </div>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                                placeholder="e.g. Refund Request Flow"
                                value={formName}
                                onChange={(e) => onSetFormName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Domain (optional)</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={() => onSetShowDomainForm(true)}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> New Domain
                                </Button>
                            </div>
                            {showDomainForm ? (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Domain name"
                                        value={newDomainName}
                                        onChange={(e) => onSetNewDomainName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && onCreateDomain()}
                                    />
                                    <Button size="sm" onClick={onCreateDomain}>Add</Button>
                                    <Button size="sm" variant="ghost" onClick={() => onSetShowDomainForm(false)}>✕</Button>
                                </div>
                            ) : (
                                <Select value={formDomain || "none"} onValueChange={(v) => onSetFormDomain(v === "none" ? "" : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="No domain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No domain</SelectItem>
                                        {domains.map(d => (
                                            <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                            placeholder="Brief description of this test scenario"
                            value={formDescription}
                            onChange={(e) => onSetFormDescription(e.target.value)}
                        />
                    </div>

                    {/* Creation Method Selector */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Label>Add Conversations:</Label>
                            <div className="flex gap-1">
                                <Button
                                    variant={creationMethod === 'manual' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSetCreationMethod('manual')}
                                >
                                    <Pencil className="w-4 h-4 mr-1" /> Manual
                                </Button>
                                <Button
                                    variant={creationMethod === 'upload' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSetCreationMethod('upload')}
                                >
                                    <Upload className="w-4 h-4 mr-1" /> Upload CSV
                                </Button>
                                <Button
                                    variant={creationMethod === 'generate' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onSetCreationMethod('generate')}
                                >
                                    <Sparkles className="w-4 h-4 mr-1" /> AI Generate
                                </Button>
                            </div>
                        </div>

                        {/* CSV Upload Panel */}
                        {creationMethod === 'upload' && (
                            <Card className="bg-muted/30">
                                <CardContent className="pt-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label>Paste CSV content (with "query" column)</Label>
                                        <Textarea
                                            placeholder="query&#10;How do I get a refund?&#10;What is your return policy?"
                                            value={csvContent}
                                            onChange={(e) => onSetCsvContent(e.target.value)}
                                            rows={4}
                                        />
                                        <Button size="sm" onClick={onParseCSV} disabled={!csvContent.trim()}>
                                            Parse CSV
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* AI Generation Panel */}
                        {creationMethod === 'generate' && (
                            <Card className="bg-muted/30">
                                <CardContent className="pt-4 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Single-turn questions</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={20}
                                                value={generateSingleCount}
                                                onChange={(e) => onSetGenerateSingleCount(parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Multi-turn conversations</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={10}
                                                value={generateMultiCount}
                                                onChange={(e) => onSetGenerateMultiCount(parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Turns per multi</Label>
                                            <Input
                                                type="number"
                                                min={2}
                                                max={5}
                                                value={generateTurnsPerMulti}
                                                onChange={(e) => onSetGenerateTurnsPerMulti(parseInt(e.target.value) || 3)}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        AI will use the suite name and description to generate relevant test conversations.
                                    </p>
                                    <Button onClick={onGenerate} disabled={isGenerating}>
                                        {isGenerating ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                                        ) : (
                                            <><Sparkles className="w-4 h-4 mr-2" /> Generate Conversations</>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Preview Generated/Parsed Conversations */}
                        {previewConversations.length > 0 && (
                            <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Generated {previewConversations.length} Conversations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="max-h-48 overflow-auto space-y-2">
                                        {previewConversations.map((conv, i) => (
                                            <div key={i} className="p-2 bg-background rounded border text-sm">
                                                <strong>{conv.name}</strong>
                                                <div className="text-muted-foreground">
                                                    {conv.turns.map((t, j) => (
                                                        <div key={j} className="truncate">
                                                            <User className="w-3 h-3 inline mr-1" />
                                                            {t.message}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={onAddPreviewToForm}>
                                            <Plus className="w-4 h-4 mr-1" /> Add All to Suite
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => onSetPreviewConversations([])}>
                                            Discard
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Conversation Tabs */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Conversations</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newConv: Conversation = {
                                        name: `Conversation ${formConversations.length + 1}`,
                                        turns: [{ role: 'user', message: '' }]
                                    }
                                    onSetFormConversations(prev => [...prev, newConv])
                                    onSetActiveConversationIndex(formConversations.length)
                                }}
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Conversation
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formConversations.map((conv, idx) => (
                                <div key={idx} className="relative group">
                                    <Button
                                        variant={idx === activeConversationIndex ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onSetActiveConversationIndex(idx)}
                                        className="pr-6"
                                    >
                                        {conv.name}
                                    </Button>
                                    {formConversations.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                const updated = formConversations.filter((_, i) => i !== idx)
                                                onSetFormConversations(updated)
                                                if (activeConversationIndex >= updated.length) {
                                                    onSetActiveConversationIndex(updated.length - 1)
                                                }
                                            }}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {formConversations.length > 1 && (
                            <p className="text-xs text-muted-foreground">
                                {formConversations.length} conversations in this suite. Click to switch.
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>User Inputs</Label>
                                <p className="text-xs text-muted-foreground">
                                    Define what the user says. The agent will respond when you run the test.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={onAddTurn}>
                                <Plus className="w-4 h-4 mr-1" /> Add Input
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formTurns.filter(t => t.role === 'user').length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Add at least one user input to test
                                </p>
                            )}
                            {formTurns.map((turn, index) => (
                                turn.role === 'user' ? (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="flex items-center gap-2 w-20 pt-2">
                                            <User className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm text-muted-foreground">User</span>
                                        </div>
                                        <Textarea
                                            className="flex-1 min-h-[60px]"
                                            placeholder="What the user says to the agent..."
                                            value={turn.message}
                                            onChange={(e) => onUpdateTurn(index, 'message', e.target.value)}
                                        />
                                        {formTurns.filter(t => t.role === 'user').length > 1 && (
                                            <Button variant="ghost" size="icon" onClick={() => onRemoveTurn(index)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ) : null
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Attached Judges</Label>
                        <div className="flex flex-wrap gap-2">
                            {judges.map(judge => (
                                <Badge
                                    key={judge._id}
                                    variant={formJudgeIds.includes(judge._id) ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => onToggleJudge(judge._id)}
                                >
                                    {judge.name}
                                </Badge>
                            ))}
                            {judges.length === 0 && (
                                <p className="text-sm text-muted-foreground">No judges available. Create judges in the Define tab.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSave} disabled={!formName.trim()}>
                        {editingId ? "Update" : "Create"} Test Data
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
