'use client'

import { Users, UserCheck, UserPlus, Link as LinkIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardsProps {
    stats: {
        totalUsers: number
        totalContributors: number
        pendingContributors: number
        totalPlatformLinks: number
        recentUsers: number
    }
}

export function AdminStatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            description: `+${stats.recentUsers} this week`
        },
        {
            title: 'Active Contributors',
            value: stats.totalContributors,
            icon: UserCheck,
            description: 'Approved contributors'
        },
        {
            title: 'Pending Applications',
            value: stats.pendingContributors,
            icon: UserPlus,
            description: 'Awaiting review'
        },
        {
            title: 'Platform Links',
            value: stats.totalPlatformLinks,
            icon: LinkIcon,
            description: 'Total connected'
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
