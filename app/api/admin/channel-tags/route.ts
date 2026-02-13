
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { isAdmin } from '@/lib/auth'

// GET: Fetch all tags
export async function GET() {
    try {
        const tags = await prisma.channelTag.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(tags)
    } catch (error) {
        console.error('Error fetching channel tags:', error)
        return NextResponse.json(
            { error: 'Failed to fetch tags' },
            { status: 500 }
        )
    }
}

// POST: Create a new tag
export async function POST(request: Request) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { name, color } = body

        if (!name || !color) {
            return NextResponse.json(
                { error: 'Name and color are required' },
                { status: 400 }
            )
        }

        const tag = await prisma.channelTag.create({
            data: {
                name,
                color
            }
        })

        return NextResponse.json(tag)
    } catch (error) {
        console.error('Error creating channel tag:', error)
        return NextResponse.json(
            { error: 'Failed to create tag' },
            { status: 500 }
        )
    }
}

// PUT: Update a tag
export async function PUT(request: Request) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { id, name, color } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Tag ID is required' },
                { status: 400 }
            )
        }

        const tag = await prisma.channelTag.update({
            where: { id },
            data: {
                name,
                color
            }
        })

        return NextResponse.json(tag)
    } catch (error) {
        console.error('Error updating channel tag:', error)
        return NextResponse.json(
            { error: 'Failed to update tag' },
            { status: 500 }
        )
    }
}

// DELETE: Delete a tag
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
                { error: 'Tag ID is required' },
                { status: 400 }
            )
        }

        await prisma.channelTag.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting channel tag:', error)
        return NextResponse.json(
            { error: 'Failed to delete tag' },
            { status: 500 }
        )
    }
}
