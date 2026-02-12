import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'
import { logActivity, ActivityActions } from '@/lib/activity-logger'

// GET - Get staff member details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.username) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params
        const staff = await prisma.admin.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                        profilePicture: true,
                        createdAt: true
                    }
                }
            }
        })

        if (!staff) {
            return NextResponse.json(
                { error: 'Staff member not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(staff)
    } catch (error) {
        console.error('Error fetching staff member:', error)
        return NextResponse.json(
            { error: 'Failed to fetch staff member' },
            { status: 500 }
        )
    }
}

// PUT - Update staff member
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { role, department, permissions, status } = data

        const { id } = await params
        const staff = await prisma.admin.update({
            where: { id },
            data: {
                ...(role && { role }),
                ...(department !== undefined && { department }),
                ...(permissions && { permissions }),
                ...(status && { status })
            },
            include: {
                user: true
            }
        })

        // Update user role if changed
        if (role) {
            await prisma.user.update({
                where: { id: staff.userId },
                data: { role }
            })
        }

        // Log activity
        await logActivity({
            userId: currentUser.id,
            action: ActivityActions.UPDATE_STAFF,
            entityType: 'Admin',
            entityId: id,
            metadata: {
                targetUsername: staff.user.username,
                changes: { role, department, status }
            }
        })

        return NextResponse.json(staff)
    } catch (error) {
        console.error('Error updating staff member:', error)
        return NextResponse.json(
            { error: 'Failed to update staff member' },
            { status: 500 }
        )
    }
}

// DELETE - Remove staff member
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params
        const staff = await prisma.admin.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        })

        if (!staff) {
            return NextResponse.json(
                { error: 'Staff member not found' },
                { status: 404 }
            )
        }

        // Delete admin record
        await prisma.admin.delete({
            where: { id }
        })

        // Reset user role
        await prisma.user.update({
            where: { id: staff.userId },
            data: { role: 'user' }
        })

        // Log activity
        await logActivity({
            userId: currentUser.id,
            action: ActivityActions.DELETE_STAFF,
            entityType: 'Admin',
            entityId: id,
            metadata: {
                targetUsername: staff.user.username,
                previousRole: staff.role
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting staff member:', error)
        return NextResponse.json(
            { error: 'Failed to delete staff member' },
            { status: 500 }
        )
    }
}
