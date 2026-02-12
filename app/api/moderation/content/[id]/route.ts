import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../../auth/[...nextauth]/route'

// PUT - Approve/Reject content
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

        // Check if user is admin or moderator
        const user = await prisma.user.findUnique({
            where: { username: session.user.username },
            select: { id: true, isAdmin: true, role: true }
        })

        if (!user?.isAdmin && user?.role !== 'moderator') {
            return NextResponse.json(
                { error: 'Forbidden - Moderator or Admin access required' },
                { status: 403 }
            )
        }

        const data = await request.json()
        const { status, rejectionReason } = data

        if (!['Approved', 'Rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            )
        }

        const content = await prisma.content.update({
            where: { id: params.id },
            data: {
                status,
                verifiedBy: user.id,
                verificationDate: new Date(),
                ...(rejectionReason && { rejectionReason }),
                ...(status === 'Approved' && { publishedAt: new Date() })
            },
            include: {
                contributor: true
            }
        })

        // Update contributor stats if approved
        if (status === 'Approved') {
            await prisma.contributor.update({
                where: { id: content.contributorId },
                data: {
                    contributionCount: { increment: 1 }
                }
            })
        }

        return NextResponse.json(content)
    } catch (error) {
        console.error('Error verifying content:', error)
        return NextResponse.json(
            { error: 'Failed to verify content' },
            { status: 500 }
        )
    }
}

// GET - Get content details
export async function GET(
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

        const content = await prisma.content.findUnique({
            where: { id: params.id },
            include: {
                contributor: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                },
                verifier: {
                    select: {
                        username: true
                    }
                }
            }
        })

        if (!content) {
            return NextResponse.json(
                { error: 'Content not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(content)
    } catch (error) {
        console.error('Error fetching content:', error)
        return NextResponse.json(
            { error: 'Failed to fetch content' },
            { status: 500 }
        )
    }
}
