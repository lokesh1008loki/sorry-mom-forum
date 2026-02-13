
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const channels = await prisma.telegramChannel.findMany({
            where: { isActive: true },
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
