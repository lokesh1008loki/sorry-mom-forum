import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'

// POST - Upload new content
export async function POST(request: Request) {
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

        if (!user?.isContributor || !user.contributor) {
            return NextResponse.json(
                { error: 'Only contributors can upload content' },
                { status: 403 }
            )
        }

        if (user.contributor.status !== 'Approved') {
            return NextResponse.json(
                { error: 'Your contributor account must be approved first' },
                { status: 403 }
            )
        }

        const data = await request.json()
        const { title, description, contentType, contentUrl, body } = data

        if (!title || !contentType) {
            return NextResponse.json(
                { error: 'Title and content type are required' },
                { status: 400 }
            )
        }

        // Create content
        const content = await prisma.content.create({
            data: {
                title,
                description,
                contentType,
                contentUrl,
                body,
                contributorId: user.contributor.id,
                status: 'Pending'
            },
            include: {
                contributor: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(content, { status: 201 })
    } catch (error) {
        console.error('Error creating content:', error)
        return NextResponse.json(
            { error: 'Failed to create content' },
            { status: 500 }
        )
    }
}

// GET - List contributor's own content
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

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || undefined

        const contents = await prisma.content.findMany({
            where: {
                contributorId: user.contributor.id,
                ...(status && { status })
            },
            orderBy: { createdAt: 'desc' },
            include: {
                verifier: {
                    select: {
                        username: true
                    }
                }
            }
        })

        return NextResponse.json(contents)
    } catch (error) {
        console.error('Error fetching content:', error)
        return NextResponse.json(
            { error: 'Failed to fetch content' },
            { status: 500 }
        )
    }
}
