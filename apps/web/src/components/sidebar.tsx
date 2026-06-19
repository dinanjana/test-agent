"use client"

import React from "react"
import { useApp } from "./app-context"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Plug,
    Search,
    Scale,
    Play,
    Wrench,
    ChevronDown,
    CheckCircle2,
    XCircle,
    Circle
} from "lucide-react"
import { SettingsModal } from "./settings-modal"

interface SidebarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "connect", label: "Connect", icon: Plug },
    // { id: "discover", label: "Discover", icon: Search }, // Disabled for now
    { id: "define", label: "Define", icon: Scale },
    { id: "simulate", label: "Simulate", icon: Play },
    { id: "fix", label: "Fix", icon: Wrench },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const { environments, currentEnvironment, setCurrentEnvironment } = useApp()

    return (
        <aside className="w-56 border-r bg-muted/30 flex flex-col">
            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            activeTab === item.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Settings */}
            <div className="px-3 pb-2">
                <SettingsModal />
            </div>

            {/* Environment Selector */}
            <div className="p-3 border-t">
                <p className="text-xs text-muted-foreground mb-2 px-1">Environment</p>
                <div className="space-y-1">
                    {environments.map((env) => (
                        <button
                            key={env._id}
                            onClick={() => setCurrentEnvironment(env)}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                currentEnvironment?._id === env._id
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:bg-accent/50"
                            )}
                        >
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: env.color }}
                            />
                            <span className="flex-1 text-left truncate">{env.name}</span>
                            {env.last_test_status === 'success' && (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                            )}
                            {env.last_test_status === 'failed' && (
                                <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            {!env.last_test_status && (
                                <Circle className="h-3 w-3 text-muted-foreground/50" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    )
}
