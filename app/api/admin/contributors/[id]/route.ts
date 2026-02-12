import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.username) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if user is admin and get their ID
        const adminUser = await prisma.user.findUnique({
            where: { username: session.user.username },
            select: { id: true, isAdmin: true }
        })

        if (!adminUser?.isAdmin) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            )
        }

        const data = await request.json()
        const { status, bio } = data

        const updateData: any = {}

        if (bio) updateData.bio = bio

        if (status) {
            updateData.status = status
            updateData.approvalDate = new Date()
            updateData.reviewedByAdmin = adminUser.id
        }

        const updatedContributor = await prisma.contributor.update({
            where: { id: params.id },
            data: updateData,
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                platformLinks: true
            }
        })

        // If approved, update user's isContributor field
        if (status === 'Approved') {
            await prisma.user.update({
                where: { id: updatedContributor.userId },
                data: { isContributor: true }
            })
        } else if (status === 'Rejected') {
            await prisma.user.update({
                where: { id: updatedContributor.userId },
                data: { isContributor: false }
            })
        }

        return NextResponse.json(updatedContributor)
    } catch (error) {
        console.error('Error updating contributor:', error)
        return NextResponse.json(
            { error: 'Failed to update contributor' },
            { status: 500 }
        )
    }
}
