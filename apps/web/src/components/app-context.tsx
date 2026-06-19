"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

interface App {
    _id: string
    name: string
    slug: string
    description?: string
}

interface Environment {
    _id: string
    app_id: string
    name: string
    slug: string
    endpoint_url: string
    color: string
    is_default: boolean
    last_test_status?: 'success' | 'failed'
    last_test_latency_ms?: number
}

interface AppContextType {
    apps: App[]
    currentApp: App | null
    environments: Environment[]
    currentEnvironment: Environment | null
    isLoading: boolean
    setCurrentApp: (app: App | null) => void
    setCurrentEnvironment: (env: Environment | null) => void
    refreshApps: () => Promise<void>
    refreshEnvironments: () => Promise<void>
    createApp: (name: string, description?: string) => Promise<App | null>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [apps, setApps] = useState<App[]>([])
    const [currentApp, setCurrentApp] = useState<App | null>(null)
    const [environments, setEnvironments] = useState<Environment[]>([])
    const [currentEnvironment, setCurrentEnvironment] = useState<Environment | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshApps = async () => {
        try {
            const data = await apiClient.get<App[]>("/api/apps")
            setApps(data)

            // Auto-select first app if none selected
            if (data.length > 0 && !currentApp) {
                setCurrentApp(data[0])
            }
        } catch (error) {
            console.error("Failed to fetch apps", error)
        }
    }

    const refreshEnvironments = async () => {
        if (!currentApp) {
            setEnvironments([])
            return
        }

        try {
            const data = await apiClient.get<Environment[]>(`/api/apps/${currentApp._id}/environments`)
            setEnvironments(data)

            // Auto-select default environment
            const defaultEnv = data.find((e: Environment) => e.is_default)
            if (defaultEnv) {
                setCurrentEnvironment(defaultEnv)
            } else if (data.length > 0) {
                setCurrentEnvironment(data[0])
            }
        } catch (error) {
            console.error("Failed to fetch environments", error)
        }
    }

    const createApp = async (name: string, description?: string): Promise<App | null> => {
        try {
            const app = await apiClient.post<App>("/api/apps", { name, description })
            await refreshApps()
            setCurrentApp(app)
            return app
        } catch (error) {
            console.error("Failed to create app", error)
        }
        return null
    }

    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            await refreshApps()
            setIsLoading(false)
        }
        init()
    }, [])

    useEffect(() => {
        refreshEnvironments()
    }, [currentApp])

    return (
        <AppContext.Provider value={{
            apps,
            currentApp,
            environments,
            currentEnvironment,
            isLoading,
            setCurrentApp,
            setCurrentEnvironment,
            refreshApps,
            refreshEnvironments,
            createApp
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("useApp must be used within AppProvider")
    }
    return context
}
