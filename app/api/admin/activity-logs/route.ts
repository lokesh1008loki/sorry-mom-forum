import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'

// GET - Fetch activity logs (admin only)
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

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId') || undefined
        const action = searchParams.get('action') || undefined
        const entityType = searchParams.get('entityType') || undefined
        const limit = parseInt(searchParams.get('limit') || '100')
        const page = parseInt(searchParams.get('page') || '1')
        const skip = (page - 1) * limit

        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where: {
                    ...(userId && { userId }),
                    ...(action && { action }),
                    ...(entityType && { entityType })
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip
            }),
            prisma.activityLog.count({
                where: {
                    ...(userId && { userId }),
                    ...(action && { action }),
                    ...(entityType && { entityType })
                }
            })
        ])

        // Fetch user details for logs
        const userIds = [...new Set(logs.map(log => log.userId).filter(Boolean))] as string[]
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true, email: true }
        })

        const userMap = new Map(users.map(u => [u.id, u]))

        // Enrich logs with user details
        const enrichedLogs = logs.map(log => ({
            ...log,
            user: log.userId ? userMap.get(log.userId) : null,
            metadata: log.metadata ? JSON.parse(log.metadata) : null
        }))

        return NextResponse.json({
            logs: enrichedLogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching activity logs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activity logs' },
            { status: 500 }
        )
    }
}
