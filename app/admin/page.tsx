'use client'

import { useEffect, useState } from 'react'
import { AdminStatsCards } from '@/components/admin-stats-cards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, TrendingUp } from 'lucide-react'

interface Stats {
    totalUsers: number
    totalContributors: number
    pendingContributors: number
    totalPlatformLinks: number
    recentUsers: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats')
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-destructive">Failed to load dashboard data</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to the admin panel. Overview of your forum statistics.
                </p>
            </div>

            <AdminStatsCards stats={stats} />

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            System activity overview
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">New users this week</span>
                                <span className="font-bold">{stats.recentUsers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Pending applications</span>
                                <span className="font-bold">{stats.pendingContributors}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Active contributors</span>
                                <span className="font-bold">{stats.totalContributors}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Quick Stats
                        </CardTitle>
                        <CardDescription>
                            Platform overview
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Total users</span>
                                <span className="font-bold">{stats.totalUsers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Platform links</span>
                                <span className="font-bold">{stats.totalPlatformLinks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Contributors</span>
                                <span className="font-bold">{stats.totalContributors}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
