"use client"

import React, { useEffect, useState } from "react"
import { useApp } from "./app-context"
import { TrendingUp, TrendingDown, Activity, CheckCircle2, AlertTriangle, Clock, Folder } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface DashboardStats {
    passRate: number
    totalRuns: number
    recentRuns: number
    dailyTrend: { date: string; passRate: number; total: number }[]
}

interface RecentRun {
    _id: string
    test_data_name: string
    environment_name: string
    overall_passed: boolean
    total_latency_ms: number
    completed_at: string
    domain_id?: string
}

interface DomainStats {
    domain_id: string
    domain_name: string
    total_runs: number
    passed_runs: number
    pass_rate: number
}

export function Dashboard() {
    const { currentApp } = useApp()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentRuns, setRecentRuns] = useState<RecentRun[]>([])
    const [domainStats, setDomainStats] = useState<DomainStats[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (currentApp?._id) {
            fetchDashboardData()
        }
    }, [currentApp?._id])

    const fetchDashboardData = async () => {
        if (!currentApp?._id) return
        setLoading(true)

        try {
            // Fetch stats
            try {
                const statsData = await apiClient.get<DashboardStats & { domainStats?: DomainStats[] }>(`/api/apps/${currentApp._id}/runs/stats`)
                setStats(statsData)
                // Extract domain stats if available
                if (statsData.domainStats) {
                    setDomainStats(statsData.domainStats)
                }
            } catch (e) {
                console.error('Failed to fetch stats:', e)
            }

            // Fetch recent runs
            try {
                const runsData = await apiClient.get<{ runs: RecentRun[] }>(`/api/apps/${currentApp._id}/runs?limit=5`)
                setRecentRuns(runsData.runs || [])
            } catch (e) {
                console.error('Failed to fetch recent runs:', e)
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                    <p className="text-muted-foreground">Loading quality metrics...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 rounded-lg border bg-card animate-pulse">
                            <div className="h-4 bg-muted rounded w-24 mb-2" />
                            <div className="h-8 bg-muted rounded w-16" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const hasData = stats && (stats.totalRuns > 0)
    const passRateTrend = stats?.dailyTrend && stats.dailyTrend.length >= 2
        ? stats.dailyTrend[stats.dailyTrend.length - 1].passRate - stats.dailyTrend[0].passRate
        : 0

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-muted-foreground">
                    Quality overview for {currentApp?.name}
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pass Rate */}
                <div className="p-6 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Pass Rate</p>
                        {passRateTrend !== 0 && (
                            <div className={`flex items-center text-sm ${passRateTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {passRateTrend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                {Math.abs(passRateTrend)}%
                            </div>
                        )}
                    </div>
                    <p className="text-3xl font-bold mt-1">
                        {hasData ? `${stats.passRate}%` : '--'}
                    </p>
                </div>

                {/* Test Runs */}
                <div className="p-6 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Test Runs (7d)</p>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold mt-1">
                        {stats?.recentRuns ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats?.totalRuns ?? 0} total
                    </p>
                </div>

                {/* Latest Result */}
                <div className="p-6 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground">Latest Result</p>
                    {recentRuns.length > 0 ? (
                        <div className="mt-1">
                            <div className="flex items-center gap-2">
                                {recentRuns[0].overall_passed ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                    <AlertTriangle className="h-6 w-6 text-red-500" />
                                )}
                                <span className="text-lg font-semibold">
                                    {recentRuns[0].overall_passed ? 'Passed' : 'Failed'}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {recentRuns[0].test_data_name} • {recentRuns[0].environment_name}
                            </p>
                        </div>
                    ) : (
                        <p className="text-3xl font-bold mt-1">--</p>
                    )}
                </div>
            </div>

            {/* Recent Runs Table */}
            <div className="rounded-lg border bg-card">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Recent Test Runs</h3>
                </div>
                {recentRuns.length > 0 ? (
                    <div className="divide-y">
                        {recentRuns.map((run) => (
                            <div key={run._id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {run.overall_passed ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    )}
                                    <div>
                                        <p className="font-medium">{run.test_data_name}</p>
                                        <p className="text-sm text-muted-foreground">{run.environment_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {run.total_latency_ms}ms
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(run.completed_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-muted-foreground">
                        <p>No test runs yet.</p>
                        <p className="text-sm">Create test data and run simulations to see quality metrics.</p>
                    </div>
                )}
            </div>

            {/* Pass Rate Trends */}
            {stats?.dailyTrend && stats.dailyTrend.length > 0 && (
                <div className="rounded-lg border bg-card">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold">Pass Rate Trend (7 Days)</h3>
                    </div>
                    <div className="p-4">
                        <div className="flex items-end gap-1 h-32">
                            {stats.dailyTrend.map((day, i) => (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full rounded-t transition-all"
                                        style={{
                                            height: `${Math.max(day.passRate, 5)}%`,
                                            backgroundColor: day.passRate >= 80 ? '#22c55e' : day.passRate >= 50 ? '#eab308' : '#ef4444'
                                        }}
                                        title={`${day.date}: ${day.passRate}% (${day.total} runs)`}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>Pass Rate</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Domain Breakdown */}
            {domainStats.length > 0 && (
                <div className="rounded-lg border bg-card">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Folder className="h-4 w-4" />
                            Quality by Domain
                        </h3>
                    </div>
                    <div className="divide-y">
                        {domainStats.map((domain) => (
                            <div key={domain.domain_id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${domain.pass_rate >= 80 ? 'bg-green-500' :
                                                domain.pass_rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                    />
                                    <span className="font-medium">{domain.domain_name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {domain.passed_runs}/{domain.total_runs} passed
                                    </span>
                                    <span className={`font-semibold ${domain.pass_rate >= 80 ? 'text-green-500' :
                                            domain.pass_rate >= 50 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {domain.pass_rate}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
