import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ContributorLayout } from '@/components/contributor-layout'

export default async function ContributorPanelLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.username) {
        redirect('/login?from=/contributor-panel')
    }

    // Check if user is a contributor
    const user = await prisma.user.findUnique({
        where: { username: session.user.username },
        include: { contributor: true }
    })

    if (!user?.isContributor || !user.contributor) {
        redirect('/')
    }

    if (user.contributor.status !== 'Approved') {
        redirect('/')
    }

    return <ContributorLayout>{children}</ContributorLayout>
}
