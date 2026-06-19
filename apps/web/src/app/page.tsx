"use client"

import React, { useState } from "react"
import { AppProvider, useApp } from "@/components/app-context"
import { AppSelector } from "@/components/app-selector"
import { Sidebar } from "@/components/sidebar"
import { AppOnboarding } from "@/components/app-onboarding"
import { EnvironmentManager } from "@/components/environment-manager"
import { JudgeBuilder } from "@/components/judge-builder"
import { TestDataManager } from "@/components/test-data-manager"
import { Dashboard } from "@/components/dashboard"
import { ConversationImporter } from "@/components/conversation-importer"
import { SettingsModal } from "@/components/settings-modal"
import { RunDetailsPanel } from "@/components/run-details-panel"
import { apiClient } from "@/lib/api-client"



function DiscoverModule() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Discover</h2>
                <p className="text-muted-foreground">
                    Collect and annotate agent responses to create test data
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <ConversationImporter />
                <div className="p-8 rounded-lg border border-dashed text-center text-muted-foreground">
                    <p className="text-sm mb-2">Production Integration</p>
                    <p className="text-xs">Connect to production logs coming soon</p>
                </div>
            </div>
        </div>
    )
}

function FixModule() {
    const { currentApp } = useApp()
    const [failedRuns, setFailedRuns] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedRunId, setSelectedRunId] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (currentApp?._id) fetchFailedRuns()
    }, [currentApp?._id])

    const fetchFailedRuns = async () => {
        if (!currentApp?._id) return
        setLoading(true)
        try {
            const data = await apiClient.get<{ runs: any[] }>(`/api/apps/${currentApp._id}/runs?limit=20`)
            setFailedRuns((data.runs || []).filter((r: any) => !r.overall_passed))
        } catch (error) {
            console.error('Failed to fetch runs:', error)
        } finally {
            setLoading(false)
        }
    }

    const rootCauseCategories = [
        { name: 'Policy Violation', count: failedRuns.filter(r => r.judge_results?.some((j: any) => j.judge_name?.includes('limit') || j.judge_name?.includes('policy'))).length },
        { name: 'Hallucination', count: failedRuns.filter(r => r.judge_results?.some((j: any) => j.judge_name?.includes('halluc') || j.reasoning?.includes('hallucinat'))).length },
        { name: 'Off-Topic', count: failedRuns.filter(r => r.judge_results?.some((j: any) => j.judge_name?.includes('topic') || j.reasoning?.includes('off-topic'))).length },
        { name: 'Other', count: failedRuns.length - failedRuns.filter(r => r.judge_results?.some((j: any) => j.judge_name?.includes('limit') || j.judge_name?.includes('policy') || j.judge_name?.includes('halluc') || j.judge_name?.includes('topic'))).length },
    ].filter(c => c.count > 0)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Fix</h2>
                <p className="text-muted-foreground">
                    AI-powered analysis and fix suggestions for failed tests
                </p>
            </div>
            {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : failedRuns.length === 0 ? (
                <div className="p-12 rounded-lg border border-dashed text-center text-muted-foreground">
                    <p className="text-lg mb-2">No Failed Tests</p>
                    <p className="text-sm">All test runs have passed! 🎉</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="font-semibold">Root Cause Categories</h3>
                        {rootCauseCategories.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                                <span className="text-sm">{cat.name}</span>
                                <span className="text-sm font-semibold">{cat.count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-semibold">Recent Failures ({failedRuns.length})</h3>
                        {failedRuns.slice(0, 10).map((run: any) => (
                            <div
                                key={run._id}
                                className="p-4 rounded-lg border bg-card space-y-2 cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => setSelectedRunId(run._id)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{run.test_data_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(run.completed_at).toLocaleDateString()} • Click for details
                                    </span>
                                </div>
                                {run.judge_results?.filter((j: any) => !j.passed).slice(0, 2).map((j: any, i: number) => (
                                    <div key={i} className="text-sm text-red-600 dark:text-red-400 line-clamp-1">
                                        <span className="font-medium">{j.judge_name}:</span> {j.reasoning}
                                    </div>
                                ))}
                                {run.judge_results?.filter((j: any) => !j.passed).length > 2 && (
                                    <p className="text-xs text-muted-foreground">
                                        +{run.judge_results.filter((j: any) => !j.passed).length - 2} more failures
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Run Details Modal */}
            <RunDetailsPanel
                runId={selectedRunId}
                onClose={() => setSelectedRunId(null)}
            />
        </div>
    )
}

function AppContent() {
    const { apps, currentApp, isLoading } = useApp()
    const [activeTab, setActiveTab] = useState("dashboard")

    // Show onboarding if no apps exist
    if (!isLoading && apps.length === 0) {
        return <AppOnboarding />
    }

    // Show loading state
    if (isLoading || !currentApp) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-14 border-b px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold">TestAgent</h1>
                        <AppSelector />
                    </div>
                    <SettingsModal />
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "connect" && <EnvironmentManager />}
                    {activeTab === "discover" && <DiscoverModule />}
                    {activeTab === "define" && <JudgeBuilder />}
                    {activeTab === "simulate" && <TestDataManager />}
                    {activeTab === "fix" && <FixModule />}
                </main>
            </div>
        </div>
    )
}

export default function Home() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}
