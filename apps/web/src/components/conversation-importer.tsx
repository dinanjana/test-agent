"use client"

import React, { useRef, useState } from "react"
import { Upload, FileJson, CheckCircle2, AlertCircle, X, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "./app-context"
import { apiClient } from "@/lib/api-client"

interface ParsedConversation {
    name: string
    turns: { role: 'user' | 'agent'; message: string }[]
    valid: boolean
    error?: string
}

interface ImporterProps {
    onImportComplete?: () => void
}

/**
 * JSON Import component for bulk importing test data.
 * 
 * Expected format:
 * [
 *   {
 *     "name": "Test case name",
 *     "turns": [
 *       { "role": "user", "message": "User message" },
 *       { "role": "agent", "message": "Agent response" }
 *     ]
 *   }
 * ]
 */
export function ConversationImporter({ onImportComplete }: ImporterProps) {
    const { currentApp } = useApp()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [parsedData, setParsedData] = useState<ParsedConversation[]>([])
    const [importing, setImporting] = useState(false)
    const [importError, setImportError] = useState<string | null>(null)
    const [importSuccess, setImportSuccess] = useState(false)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImportError(null)
        setImportSuccess(false)

        try {
            const text = await file.text()
            const data = JSON.parse(text)

            if (!Array.isArray(data)) {
                throw new Error("JSON must be an array of conversation objects")
            }

            const validated: ParsedConversation[] = data.map((item, i) => {
                if (!item.name || typeof item.name !== 'string') {
                    return { ...item, valid: false, error: 'Missing or invalid name' }
                }
                if (!Array.isArray(item.turns) || item.turns.length === 0) {
                    return { ...item, valid: false, error: 'Missing or empty turns array' }
                }

                const validTurns = item.turns.every((t: any) =>
                    (t.role === 'user' || t.role === 'agent') &&
                    typeof t.message === 'string'
                )

                if (!validTurns) {
                    return { ...item, valid: false, error: 'Invalid turn format' }
                }

                return {
                    name: item.name,
                    turns: item.turns,
                    valid: true
                }
            })

            setParsedData(validated)
        } catch (error: any) {
            setImportError(error.message || "Failed to parse JSON file")
            setParsedData([])
        }
    }

    const handleImport = async () => {
        if (!currentApp) return

        const validItems = parsedData.filter(p => p.valid)
        if (validItems.length === 0) return

        setImporting(true)
        setImportError(null)

        try {
            for (const item of validItems) {
                await apiClient.post(`/api/apps/${currentApp._id}/test-data`, {
                    name: item.name,
                    turns: item.turns,
                    source_type: 'upload'
                })
            }

            setImportSuccess(true)
            setParsedData([])
            onImportComplete?.()
        } catch (error: any) {
            setImportError(error.message || "Failed to import conversations")
        } finally {
            setImporting(false)
        }
    }

    const clearAll = () => {
        setParsedData([])
        setImportError(null)
        setImportSuccess(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const validCount = parsedData.filter(p => p.valid).length
    const invalidCount = parsedData.filter(p => !p.valid).length

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileJson className="h-5 w-5" />
                    Import Conversations
                </CardTitle>
                <CardDescription>
                    Upload a JSON file with test conversations to bulk import
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* File Drop Zone */}
                <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Click to upload JSON file
                    </p>
                </div>

                {/* Error Display */}
                {importError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-lg text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {importError}
                    </div>
                )}

                {/* Success Display */}
                {importSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-lg text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Successfully imported {validCount} conversations!
                    </div>
                )}

                {/* Parsed Preview */}
                {parsedData.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                                Preview ({validCount} valid, {invalidCount} invalid)
                            </p>
                            <Button variant="ghost" size="sm" onClick={clearAll}>
                                <X className="h-3 w-3 mr-1" /> Clear
                            </Button>
                        </div>
                        <div className="max-h-48 overflow-auto space-y-2">
                            {parsedData.map((item, i) => (
                                <div
                                    key={i}
                                    className={`text-sm p-2 rounded border ${item.valid
                                            ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200'
                                            : 'bg-red-50/50 dark:bg-red-950/10 border-red-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.valid ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <AlertCircle className="h-3 w-3 text-red-500" />
                                        )}
                                        <span className="font-medium">{item.name || `Item ${i + 1}`}</span>
                                        {item.turns && (
                                            <Badge variant="secondary" className="text-xs">
                                                {item.turns.length} turns
                                            </Badge>
                                        )}
                                    </div>
                                    {item.error && (
                                        <p className="text-xs text-red-500 mt-1 ml-5">{item.error}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
            {parsedData.length > 0 && validCount > 0 && (
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleImport}
                        disabled={importing}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {importing ? 'Importing...' : `Import ${validCount} Conversation${validCount !== 1 ? 's' : ''}`}
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}
