import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'

// GET - Content moderation queue
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.username) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if user is admin or moderator
        const user = await prisma.user.findUnique({
            where: { username: session.user.username },
            select: { isAdmin: true, role: true }
        })

        if (!user?.isAdmin && user?.role !== 'moderator') {
            return NextResponse.json(
                { error: 'Forbidden - Moderator or Admin access required' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'Pending'

        const contents = await prisma.content.findMany({
            where: { status },
            orderBy: { createdAt: 'asc' },
            include: {
                contributor: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                },
                verifier: {
                    select: {
                        username: true
                    }
                }
            }
        })

        return NextResponse.json(contents)
    } catch (error) {
        console.error('Error fetching moderation queue:', error)
        return NextResponse.json(
            { error: 'Failed to fetch moderation queue' },
            { status: 500 }
        )
    }
}
