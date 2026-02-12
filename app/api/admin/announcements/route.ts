import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity, ActivityActions } from '@/lib/activity-logger'
import { isAdmin, getCurrentUser } from '@/lib/auth'

// GET /api/admin/announcements - Fetch all announcements
export async function GET(req: NextRequest) {
    try {
        const announcements = await prisma.globalAnnouncement.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(announcements)
    } catch (error) {
        console.error('Error fetching announcements:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/admin/announcements - Create a new announcement
export async function POST(req: NextRequest) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const currentUser = await getCurrentUser()
        const body = await req.json()
        const { message, type, isActive, expiresAt } = body

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        if (!currentUser?.id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const announcement = await prisma.globalAnnouncement.create({
            data: {
                message,
                type: type || 'info', // info, warning, error, success
                isActive: isActive !== undefined ? isActive : true,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                createdBy: currentUser.id
            }
        })

        // Log the action
        await logActivity({
            userId: currentUser.id,
            action: ActivityActions.CREATE_ANNOUNCEMENT,
            entityType: 'GlobalAnnouncement',
            entityId: announcement.id,
            metadata: { message, type }
        })

        return NextResponse.json(announcement)
    } catch (error) {
        console.error('Error creating announcement:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
