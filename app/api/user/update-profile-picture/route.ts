import { NextResponse } from 'next/server'
import { getSession, createSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { profilePicture } = await request.json()

    if (!profilePicture) {
      return NextResponse.json(
        { message: 'Profile picture is required' },
        { status: 400 }
      )
    }

    // Validate base64 image
    if (!profilePicture.startsWith('data:image/')) {
      return NextResponse.json(
        { message: 'Invalid image format' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
      folder: 'profile_pictures',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    })

    // Update user's profile picture with Cloudinary URL
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        profilePicture: uploadResponse.secure_url,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        isContributor: true,
      }
    })

    // Create new session with updated user data
    const sessionUser = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      isContributor: updatedUser.isContributor,
      profilePicture: updatedUser.profilePicture
    }

    await createSession(sessionUser)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile picture:', error)
    return NextResponse.json(
      { message: 'Failed to update profile picture' },
      { status: 500 }
    )
  }
} 