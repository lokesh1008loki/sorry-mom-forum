import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email } = body

    // Check username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json({
        success: false,
        message: 'Username can only contain letters, numbers, and underscores'
      })
    }

    // Check if username exists
    const existingUsername = await prisma.user.findFirst({
      where: { username }
    })

    // Check if email exists
    const existingEmail = await prisma.user.findFirst({
      where: { email }
    })

    return NextResponse.json({
      success: true,
      username: {
        available: !existingUsername,
        message: existingUsername ? 'Username is already taken' : 'Username is available'
      },
      email: {
        available: !existingEmail,
        message: existingEmail ? 'Email is already registered' : 'Email is available'
      }
    })

  } catch (error: any) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to check availability' 
      },
      { status: 500 }
    )
  }
} 