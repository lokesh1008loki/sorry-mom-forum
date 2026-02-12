import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ModerationQueue } from '@/components/moderation-queue'

export default async function ModerationPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.username) {
        redirect('/login?from=/admin/moderation')
    }

    // Check if user is admin or moderator
    const user = await prisma.user.findUnique({
        where: { username: session.user.username },
        select: { isAdmin: true, role: true }
    })

    if (!user?.isAdmin && user?.role !== 'moderator') {
        redirect('/')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Content Moderation</h1>
                <p className="text-muted-foreground">
                    Review and moderate contributor content
                </p>
            </div>

            <ModerationQueue />
        </div>
    )
}
