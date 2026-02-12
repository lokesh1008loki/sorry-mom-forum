import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = await compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session
    const session = await createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      isContributor: user.isContributor,
      profilePicture: user.profilePicture
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful! Redirecting...',
      redirectTo: '/',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isContributor: user.isContributor,
        profilePicture: user.profilePicture
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to login' },
      { status: 500 }
    )
  }
} 