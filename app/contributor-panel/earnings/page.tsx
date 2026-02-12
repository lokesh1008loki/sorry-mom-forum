'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DollarSign, TrendingUp, FileText } from 'lucide-react'

interface Analytics {
    overview: {
        totalEarnings: number
        totalContent: number
        approvedContent: number
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

export default function EarningsPage() {
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
                <p className="text-muted-foreground">Loading earnings...</p>
            </div>
        )
    }

    if (!analytics) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-destructive">Failed to load earnings</p>
            </div>
        )
    }

    const avgEarningsPerContent = analytics.overview.approvedContent > 0
        ? analytics.overview.totalEarnings / analytics.overview.approvedContent
        : 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Earnings</h1>
                <p className="text-muted-foreground">
                    Track your content monetization and earnings
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${analytics.overview.totalEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">All-time earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Content</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.approvedContent}</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics.overview.totalContent} total content
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg per Content</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${avgEarningsPerContent.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Average earnings</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Earnings Breakdown</CardTitle>
                    <CardDescription>
                        Earnings by content piece
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Likes</TableHead>
                                <TableHead className="text-right">Earnings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analytics.topContent.length > 0 ? (
                                analytics.topContent.map((content) => (
                                    <TableRow key={content.id}>
                                        <TableCell className="font-medium max-w-xs truncate">
                                            {content.title}
                                        </TableCell>
                                        <TableCell className="capitalize">{content.contentType}</TableCell>
                                        <TableCell>{content.views.toLocaleString()}</TableCell>
                                        <TableCell>{content.likes.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${content.earnings.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No earnings yet. Start creating content!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How Earnings Work</CardTitle>
                    <CardDescription>Understanding content monetization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>Earnings are calculated based on content engagement:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Views contribute to your base earnings</li>
                        <li>Likes and shares increase your earning multiplier</li>
                        <li>High-quality content earns more over time</li>
                        <li>Earnings are updated daily</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
