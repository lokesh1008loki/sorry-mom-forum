import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity, ActivityActions } from '@/lib/activity-logger'
import { isAdmin, getCurrentUser } from '@/lib/auth'

// GET /api/admin/badges - Fetch all badges
export async function GET(req: NextRequest) {
    try {
        // Publicly accessible for now (to show available badges), or restrict if needed
        const badges = await prisma.badge.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        })

        return NextResponse.json(badges)
    } catch (error) {
        console.error('Error fetching badges:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/admin/badges - Create a new badge
export async function POST(req: NextRequest) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const currentUser = await getCurrentUser()
        const body = await req.json()
        const { name, description, iconUrl, criteria } = body

        if (!name || !iconUrl) {
            return NextResponse.json({ error: 'Name and Icon URL are required' }, { status: 400 })
        }

        const badge = await prisma.badge.create({
            data: {
                name,
                description,
                iconUrl,
                criteria
            }
        })

        // Log the action
        if (currentUser?.id) {
            await logActivity({
                userId: currentUser.id,
                action: 'CREATE_BADGE',
                entityType: 'Badge',
                entityId: badge.id,
                metadata: { name, iconUrl }
            })
        }

        return NextResponse.json(badge)
    } catch (error) {
        console.error('Error creating badge:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Badge with this name already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
