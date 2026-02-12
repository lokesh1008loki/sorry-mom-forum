import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity, ActivityActions } from '@/lib/activity-logger'
import { isAdmin, getCurrentUser } from '@/lib/auth'

// GET /api/admin/settings - Fetch all system settings
export async function GET(req: NextRequest) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const settings = await prisma.systemSetting.findMany()

        // Transform array to object for easier frontend consumption { key: value }
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = {
                value: curr.value,
                type: curr.type,
                description: curr.description
            }
            return acc
        }, {} as Record<string, any>)

        return NextResponse.json(settingsMap)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/admin/settings - Update or Create a setting
export async function POST(req: NextRequest) {
    try {
        const isUserAdmin = await isAdmin()
        if (!isUserAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const currentUser = await getCurrentUser()
        const body = await req.json()
        const { key, value, type, description } = body

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Key and Value are required' }, { status: 400 })
        }

        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: {
                value: String(value),
                type: type || 'string',
                description
            },
            create: {
                key,
                value: String(value),
                type: type || 'string',
                description
            }
        })

        // Log the action
        if (currentUser?.id) {
            await logActivity({
                userId: currentUser.id,
                action: 'UPDATE_SYSTEM_SETTING',
                entityType: 'SystemSetting',
                entityId: key,
                metadata: { value, type }
            })
        }

        return NextResponse.json(setting)
    } catch (error) {
        console.error('Error updating setting:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
