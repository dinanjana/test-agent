"use client"

import React, { useState } from "react"
import { Rocket, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "./app-context"

export function AppOnboarding() {
    const { createApp, isLoading } = useApp()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const handleCreate = async () => {
        if (!name.trim()) return
        setIsCreating(true)
        await createApp(name, description || undefined)
        setIsCreating(false)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Welcome to TestAgent</CardTitle>
                    <CardDescription>
                        Let's create your first app to start testing your AI agent.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">App Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Customer Support Bot"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground">
                            This is the AI agent you want to test
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="A brief description of what this agent does..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleCreate}
                        disabled={!name.trim() || isCreating}
                    >
                        {isCreating ? (
                            "Creating..."
                        ) : (
                            <>
                                Create App & Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
