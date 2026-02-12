import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const typedPrisma = prisma as unknown as PrismaClient & {
  user: {
    findUnique: (args: any) => Promise<any>
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await Promise.resolve(context.params)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!id) {
      return new NextResponse('User ID is required', { status: 400 })
    }

    const user = await typedPrisma.user.findUnique({
      where: { username: id },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        isContributor: true
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 