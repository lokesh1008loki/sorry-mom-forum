'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PublicAccessBlocker({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Allow these paths even when "Public Content View" is disabled
    const allowedPaths = ['/login', '/register', '/privacy', '/terms']

    const isAllowed = allowedPaths.some(p => pathname.startsWith(p))

    if (isAllowed) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-6 bg-slate-50 dark:bg-slate-900">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700">
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Lock className="h-10 w-10 text-slate-500" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">Members Only Content</h1>
                <p className="text-muted-foreground mb-8">
                    This community is currently private. You must be a registered member to view content.
                </p>
                <div className="flex flex-col gap-3">
                    <Link href="/login" className="w-full">
                        <Button className="w-full" size="lg">Log In</Button>
                    </Link>
                    <Link href="/register" className="w-full">
                        <Button variant="outline" className="w-full" size="lg">Register</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
