'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Eye, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Analytics {
    overview: {
        totalContent: number
        approvedContent: number
        pendingContent: number
        totalViews: number
        totalLikes: number
        totalShares: number
        totalEarnings: number
    }
    topContent: Array<{
        id: string
        title: string
        views: number
        likes: number
        earnings: number
        contentType: string
    }>
}

export default function ContributorDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/contributor/analytics')
            if (res.ok) {
                const data = await res.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
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

    if (!analytics) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-destructive">Failed to load dashboard</p>
            </div>
        )
    }

    const stats = [
        {
            title: 'Total Content',
            value: analytics.overview.totalContent,
            icon: FileText,
            description: `${analytics.overview.approvedContent} approved, ${analytics.overview.pendingContent} pending`
        },
        {
            title: 'Total Views',
            value: analytics.overview.totalViews.toLocaleString(),
            icon: Eye,
            description: `${analytics.overview.totalLikes} likes, ${analytics.overview.totalShares} shares`
        },
        {
            title: 'Total Earnings',
            value: `$${analytics.overview.totalEarnings.toFixed(2)}`,
            icon: DollarSign,
            description: 'All-time earnings'
        },
        {
            title: 'Engagement Rate',
            value: analytics.overview.totalViews > 0
                ? `${((analytics.overview.totalLikes / analytics.overview.totalViews) * 100).toFixed(1)}%`
                : '0%',
            icon: TrendingUp,
            description: 'Likes to views ratio'
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Contributor Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's an overview of your content performance.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Content</CardTitle>
                        <CardDescription>
                            Your most viewed content pieces
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics.topContent.length > 0 ? (
                            <div className="space-y-3">
                                {analytics.topContent.map((content) => (
                                    <div key={content.id} className="flex justify-between items-center p-2 border rounded">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm truncate">{content.title}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{content.contentType}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{content.views.toLocaleString()} views</p>
                                            <p className="text-xs text-muted-foreground">${content.earnings.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No approved content yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Get started with your content
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/contributor-panel/upload">
                            <Button className="w-full">Upload New Content</Button>
                        </Link>
                        <Link href="/contributor-panel/content">
                            <Button variant="outline" className="w-full">View My Content</Button>
                        </Link>
                        <Link href="/contributor-panel/analytics">
                            <Button variant="outline" className="w-full">Detailed Analytics</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
