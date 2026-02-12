'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MaintenanceGuardProps {
    isOn: boolean
    isBypassed: boolean
    children: React.ReactNode
}

export function MaintenanceGuard({ isOn, isBypassed, children }: MaintenanceGuardProps) {
    const pathname = usePathname()

    // Always render children if maintenance is off or user is bypassed (admin)
    if (!isOn || isBypassed) {
        return <>{children}</>
    }

    // Allow access to login, auth APIs, and static assets
    // Also allow access to the register page if they want to try (though registration might be disabled separately)
    // But usually maintenance mode implies "Stop everything". 
    // We MUST allow /login. 
    const allowedPaths = ['/login', '/api/auth', '/_next']
    const isAllowed = allowedPaths.some(p => pathname.startsWith(p))

    if (isAllowed) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-4 bg-background">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
            <h1 className="text-4xl font-bold">Under Maintenance</h1>
            <p className="text-xl text-muted-foreground max-w-lg">
                We are currently upgrading the forum to bring you a better experience.
                Please check back soon.
            </p>

            <div className="mt-8 p-6 border rounded-lg bg-card max-w-sm w-full mx-auto">
                <p className="text-sm font-medium mb-4">Administrator Access</p>
                <Link href="/login" className="w-full block">
                    <Button variant="outline" className="w-full">
                        Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}
