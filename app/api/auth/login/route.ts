import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json(
        { message: 'Please provide username/email and password' },
        { status: 400 }
      )
    }

    // Try to find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    // Create session
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      isContributor: user.isContributor,
      profilePicture: user.profilePicture
    }
    await createSession(userData)

    return NextResponse.json({
      message: 'Login successful',
      user: userData
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Failed to login' },
      { status: 500 }
    )
  }
} 