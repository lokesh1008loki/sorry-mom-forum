import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    console.log('Session in get-profile-pic:', session)

    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { profilePicture: true }
    })
    console.log('User profile picture from DB:', user?.profilePicture)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      profilePicture: user.profilePicture || `https://avatar.vercel.sh/${session.username}?size=200`
    })
  } catch (error) {
    console.error('Error in get-profile-pic:', error)
    return NextResponse.json({ error: 'Failed to get profile picture' }, { status: 500 })
  }
} 