import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

// GET - Public staff directory
export async function GET(request: Request) {
    try {
        const staff = await prisma.admin.findMany({
            where: {
                status: 'Active'
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profilePicture: true
                    }
                }
            },
            orderBy: [
                { role: 'asc' },
                { createdAt: 'desc' }
            ]
        })

        // Group by role
        const groupedStaff = staff.reduce((acc, member) => {
            if (!acc[member.role]) {
                acc[member.role] = []
            }
            acc[member.role].push(member)
            return acc
        }, {} as Record<string, typeof staff>)

        return NextResponse.json(groupedStaff)
    } catch (error) {
        console.error('Error fetching public staff:', error)
        return NextResponse.json(
            { error: 'Failed to fetch staff' },
            { status: 500 }
        )
    }
}
