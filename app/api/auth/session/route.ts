import { NextResponse } from 'next/server'
import { getSession, updateSession } from '@/lib/auth'
import { Session } from 'next-auth'

interface CustomSession extends Session {
  user: {
    id: string
    username: string
    email: string
    isContributor: boolean
    profilePicture?: string | null
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const session = await getSession()
    return NextResponse.json(session || { error: 'No session found' })
  } catch (error) {
    console.error('Error getting session:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    const currentSession = await getSession() as CustomSession
    
    if (!currentSession) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Update session with new user data while preserving existing session data
    const updatedSession = await updateSession({
      ...currentSession,
      ...userData,
      // Ensure we don't lose any existing session data
      id: currentSession.user.id,
      username: currentSession.user.username,
      email: currentSession.user.email,
      isContributor: currentSession.user.isContributor,
      profilePicture: userData.profilePicture || currentSession.user.profilePicture
    })

    return NextResponse.json(updatedSession || { error: 'Failed to update session' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
} 