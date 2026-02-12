import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'

// GET - Fetch contributor analytics
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.username) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get contributor
        const user = await prisma.user.findUnique({
            where: { username: session.user.username },
            include: { contributor: true }
        })

        if (!user?.contributor) {
            return NextResponse.json(
                { error: 'Not a contributor' },
                { status: 403 }
            )
        }

        // Get content stats
        const totalContent = await prisma.content.count({
            where: { contributorId: user.contributor.id }
        })

        const approvedContent = await prisma.content.count({
            where: {
                contributorId: user.contributor.id,
                status: 'Approved'
            }
        })

        const pendingContent = await prisma.content.count({
            where: {
                contributorId: user.contributor.id,
                status: 'Pending'
            }
        })

        const totalViews = await prisma.content.aggregate({
            where: { contributorId: user.contributor.id },
            _sum: { views: true }
        })

        const totalLikes = await prisma.content.aggregate({
            where: { contributorId: user.contributor.id },
            _sum: { likes: true }
        })

        const totalShares = await prisma.content.aggregate({
            where: { contributorId: user.contributor.id },
            _sum: { shares: true }
        })

        const totalEarnings = await prisma.content.aggregate({
            where: { contributorId: user.contributor.id },
            _sum: { earnings: true }
        })

        // Get content performance over time (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentContent = await prisma.content.findMany({
            where: {
                contributorId: user.contributor.id,
                createdAt: { gte: sevenDaysAgo }
            },
            select: {
                createdAt: true,
                views: true,
                earnings: true
            },
            orderBy: { createdAt: 'asc' }
        })

        // Top performing content
        const topContent = await prisma.content.findMany({
            where: {
                contributorId: user.contributor.id,
                status: 'Approved'
            },
            orderBy: { views: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                views: true,
                likes: true,
                earnings: true,
                contentType: true
            }
        })

        return NextResponse.json({
            overview: {
                totalContent,
                approvedContent,
                pendingContent,
                totalViews: totalViews._sum.views || 0,
                totalLikes: totalLikes._sum.likes || 0,
                totalShares: totalShares._sum.shares || 0,
                totalEarnings: totalEarnings._sum.earnings || 0
            },
            contributor: {
                totalEarnings: user.contributor.totalEarnings,
                totalViews: user.contributor.totalViews
            },
            recentPerformance: recentContent,
            topContent
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
