
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { isAdmin } from '@/lib/auth'


export async function GET() {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const channels = await prisma.telegramChannel.findMany({
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
            orderBy: { priority: 'desc' }
        })

        return NextResponse.json(channels)
    } catch (error) {
        console.error('Error fetching telegram channels:', error)
        return NextResponse.json(
            { error: 'Failed to fetch channels' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { name, url, description, priority, iconUrl, isActive, tagIds } = body

        if (!name || !url) {
            return NextResponse.json(
                { error: 'Name and URL are required' },
                { status: 400 }
            )
        }

        const channel = await prisma.telegramChannel.create({
            data: {
                name,
                url,
                description,
                priority: priority ?? 0,
                iconUrl,
                isActive: isActive ?? true,
                tags: tagIds && tagIds.length > 0 ? {
                    create: tagIds.map((tagId: string) => ({
                        tag: {
                            connect: { id: tagId }
                        }
                    }))
                } : undefined
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        })

        return NextResponse.json(channel)
    } catch (error) {
        console.error('Error creating telegram channel:', error)
        return NextResponse.json(
            { error: 'Failed to create channel' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { id, tagIds, ...data } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Channel ID is required' },
                { status: 400 }
            )
        }

        // Update channel and handle tag relationships
        const channel = await prisma.telegramChannel.update({
            where: { id },
            data: {
                ...data,
                tags: tagIds !== undefined ? {
                    deleteMany: {},
                    create: tagIds.map((tagId: string) => ({
                        tag: {
                            connect: { id: tagId }
                        }
                    }))
                } : undefined
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        })

        return NextResponse.json(channel)
    } catch (error) {
        console.error('Error updating telegram channel:', error)
        return NextResponse.json(
            { error: 'Failed to update channel' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Channel ID is required' },
                { status: 400 }
            )
        }

        await prisma.telegramChannel.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting telegram channel:', error)
        return NextResponse.json(
            { error: 'Failed to delete channel' },
            { status: 500 }
        )
    }
}
