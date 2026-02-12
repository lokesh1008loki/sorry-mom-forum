import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.username) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { username: session.user.username },
            select: { isAdmin: true }
        })

        if (!user?.isAdmin) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            )
        }

        // Get statistics
        const [
            totalUsers,
            totalContributors,
            pendingContributors,
            totalPlatformLinks,
            recentUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.contributor.count({
                where: { status: 'Approved' }
            }),
            prisma.contributor.count({
                where: { status: 'Pending' }
            }),
            prisma.platformLink.count(),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            })
        ])

        // Get user growth data for the last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const userGrowth = await prisma.user.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            _count: true,
        })

        return NextResponse.json({
            totalUsers,
            totalContributors,
            pendingContributors,
            totalPlatformLinks,
            recentUsers,
            userGrowth
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        )
    }
}
