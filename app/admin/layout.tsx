import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { AdminLayout } from '@/components/admin-layout'

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.username) {
        redirect('/login?from=/admin')
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
        where: { username: session.user.username },
        select: { isAdmin: true }
    })

    if (!user?.isAdmin) {
        redirect('/')
    }

    return <AdminLayout>{children}</AdminLayout>
}
