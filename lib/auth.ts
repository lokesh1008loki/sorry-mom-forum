import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

interface Session {
  id: string
  username: string
  email: string
  isContributor: boolean
  profilePicture?: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export type User = {
  id: string
  username: string
  email: string
  isContributor: boolean
  profilePicture?: string | null
}

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function createSession(user: User) {
  // Ensure we're creating a new session with all user data
  const sessionUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    isContributor: user.isContributor,
    profilePicture: user.profilePicture
  }

  const token = await new SignJWT({ user: sessionUser })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET))

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function updateSession(session: Session) {
  try {
    const cookieStore = await cookies()
    const token = jwt.sign(session, JWT_SECRET, {
      expiresIn: '7d',
    })

    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return session
  } catch (error) {
    console.error('Error updating session:', error)
    throw new Error('Failed to update session')
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession()
    if (!session?.user?.username) {
      return false
    }

    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
      select: { isAdmin: true }
    })

    return user?.isAdmin || false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}