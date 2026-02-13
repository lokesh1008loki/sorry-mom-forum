import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-options'
import { PrismaClient } from '@prisma/client'

const typedPrisma = prisma as unknown as PrismaClient & {
  user: {
    update: (args: any) => Promise<any>;
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session in user update:', session)

    if (!session?.user?.username) {
      console.error('No session or username found')
      return NextResponse.json(
        { error: 'Unauthorized - Please log in again' },
        { status: 401 }
      )
    }

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Updating user:', session.user.username)

    const updatedUser = await typedPrisma.user.update({
      where: {
        username: session.user.username
      },
      data: {
        email
      },
      select: {
        id: true,
        username: true,
        email: true,
        isContributor: true,
      },
    })

    console.log('User updated successfully:', updatedUser)
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 