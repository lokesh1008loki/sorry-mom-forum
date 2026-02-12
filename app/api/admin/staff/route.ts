import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'
import { logActivity, ActivityActions } from '@/lib/activity-logger'

// POST - Create new staff member
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.username) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if user is super admin
        const currentUser = await prisma.user.findUnique({
            where: { username: session.user.username },
            select: { id: true, isAdmin: true, role: true }
        })

        if (!currentUser?.isAdmin || currentUser.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden - Super admin access required' },
                { status: 403 }
            )
        }

        const data = await request.json()
        const { userId, role, department, permissions } = data

        if (!userId || !role) {
            return NextResponse.json(
                { error: 'User ID and role are required' },
                { status: 400 }
            )
        }

        // Validate role
        const validRoles = ['moderator', 'developer', 'support', 'admin']
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            )
        }

        // Check if user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if user already has admin record
        const existingAdmin = await prisma.admin.findUnique({
            where: { userId }
        })

        if (existingAdmin) {
            return NextResponse.json(
                { error: 'User is already a staff member' },
                { status: 400 }
            )
        }

        // Create admin record
        const admin = await prisma.admin.create({
            data: {
                userId,
                role,
                department: department || null,
                permissions: permissions || [],
                assignedBy: currentUser.id,
                approvalDate: new Date(),
                status: 'Active'
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        })

        // Update user role field
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        // Log activity
        await logActivity({
            userId: currentUser.id,
            action: ActivityActions.CREATE_STAFF,
            entityType: 'Admin',
            entityId: admin.id,
            metadata: {
                targetUsername: targetUser.username,
                role,
                department
            }
        })

        return NextResponse.json(admin, { status: 201 })
    } catch (error) {
        console.error('Error creating staff member:', error)
        return NextResponse.json(
            { error: 'Failed to create staff member' },
            { status: 500 }
        )
    }
}

// GET - List all staff members
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
        const role = searchParams.get('role') || undefined
        const status = searchParams.get('status') || undefined

        const staff = await prisma.admin.findMany({
            where: {
                ...(role && { role }),
                ...(status && { status })
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                        profilePicture: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(staff)
    } catch (error) {
        console.error('Error fetching staff:', error)
        return NextResponse.json(
            { error: 'Failed to fetch staff' },
            { status: 500 }
        )
    }
}
