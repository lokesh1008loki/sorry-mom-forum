import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'

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
        const status = searchParams.get('status') || undefined

        const where = status ? { status } : {}

        const contributors = await prisma.contributor.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePicture: true
                    }
                },
                platformLinks: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(contributors)
    } catch (error) {
        console.error('Error fetching contributors:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contributors' },
            { status: 500 }
        )
    }
}
