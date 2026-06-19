"use client"

import { useState } from "react"
import { ChevronDown, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "./app-context"

export function AppSelector() {
    const { apps, currentApp, setCurrentApp, createApp } = useApp()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newAppName, setNewAppName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    if (!currentApp) return null

    const handleCreateApp = async () => {
        if (!newAppName.trim()) return
        setIsCreating(true)
        try {
            const app = await createApp(newAppName)
            if (app) {
                setNewAppName("")
                setIsDialogOpen(false)
            }
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[180px] justify-between">
                        <span className="truncate">{currentApp.name}</span>
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                    {apps.map((app) => (
                        <DropdownMenuItem
                            key={app._id}
                            onClick={() => setCurrentApp(app)}
                            className="flex items-center justify-between"
                        >
                            <span className="truncate">{app.name}</span>
                            {app._id === currentApp._id && (
                                <Check className="h-4 w-4 text-primary" />
                            )}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-muted-foreground cursor-pointer"
                        onSelect={() => setIsDialogOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New App
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Application</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">App Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Customer Support Bot"
                                value={newAppName}
                                onChange={(e) => setNewAppName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateApp()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateApp} disabled={!newAppName.trim() || isCreating}>
                            {isCreating ? "Creating..." : "Create App"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
