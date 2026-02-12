import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const typedPrisma = prisma as unknown as PrismaClient & {
  user: {
    update: (args: any) => Promise<any>;
  }
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in update-profile-pic:', session);

    if (!session?.user?.username) {
      console.error('No session or username found');
      return NextResponse.json(
        { error: 'Unauthorized - Please log in again' },
        { status: 401 }
      );
    }

    const { profilePicture } = await request.json();
    if (!profilePicture) {
      return NextResponse.json(
        { error: 'Profile picture URL is required' },
        { status: 400 }
      );
    }

    console.log('Updating profile picture for user:', session.user.username);
    
    const updatedUser = await typedPrisma.user.update({
      where: { 
        username: session.user.username 
      },
      data: { 
        profilePicture 
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        isContributor: true,
      },
    });

    console.log('Profile picture updated successfully:', updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to update profile picture' },
      { status: 500 }
    );
  }
} 