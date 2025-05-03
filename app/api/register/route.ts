import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, dob, wantContributor, contributorBio, contributorTelegramId, platformLinks, verificationPhrase } = body

    // Validate username and email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Username is already taken. Please choose a different username.' 
          },
          { status: 400 }
        )
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Email is already registered. Please use a different email.' 
          },
          { status: 400 }
        )
      }
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters long.' 
        },
        { status: 400 }
      )
    }

    // Validate date of birth (must be at least 18 years old)
    const dobDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - dobDate.getFullYear()
    const monthDiff = today.getMonth() - dobDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--
    }

    if (age < 18) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'You must be at least 18 years old to register.' 
        },
        { status: 400 }
      )
    }

    // Validate contributor fields if registering as contributor
    if (wantContributor) {
      if (!contributorBio || contributorBio.length < 10) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please provide a detailed bio (at least 10 characters).' 
          },
          { status: 400 }
        )
      }

      if (!contributorTelegramId || contributorTelegramId.length < 3) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please provide a valid Telegram ID.' 
          },
          { status: 400 }
        )
      }

      if (!platformLinks || platformLinks.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please add at least one platform link.' 
          },
          { status: 400 }
        )
      }

      // Validate platform links
      for (const link of platformLinks) {
        if (!link.platform || !link.url) {
          return NextResponse.json(
            { 
              success: false, 
              message: 'Please provide both platform and URL for all platform links.' 
            },
            { status: 400 }
          )
        }
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        dateOfBirth: new Date(dob),
        isContributor: wantContributor || false,
      }
    })

    // If user wants to be a contributor, create contributor profile
    if (wantContributor && user) {
      await prisma.contributor.create({
        data: {
          bio: contributorBio || '',
          telegramId: contributorTelegramId || '',
          verificationPhrase,
          userId: user.id,
          platformLinks: {
            create: (platformLinks || []).map((link: any) => ({
              platform: link.platform,
              url: link.url
            }))
          }
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: wantContributor 
        ? '🎉 Your contributor account has been created successfully! You will be redirected to the login page in 5 seconds.'
        : '🎉 Your account has been created successfully! You will be redirected to the login page in 5 seconds.',
      loginLink: '/login',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isContributor: user.isContributor
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Registration failed' 
      },
      { status: 500 }
    )
  }
} 