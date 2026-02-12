import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from "@/components/site-footer"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"
import { LanguageInitializer } from "@/components/language-initializer"
import { LanguageNotification } from "@/components/language-notification"
import { RTAInformation } from "@/components/rta-information"
import { ScrollNavigationButtons } from "@/components/scroll-navigation-buttons"
import { ReactNode } from "react"
import { Toaster } from "sonner"
import { getSession } from "@/lib/auth"
import { MobileLoggedInNav } from "@/components/mobile-logged-in-nav"
import { Session } from "next-auth"
import { Providers } from "@/components/providers"
import { getSystemSettings } from '@/lib/settings'
import { Lock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings()
  return {
    title: settings.site_name || 'Sorry Mom Forum',
    description: 'A forum for sharing stories and experiences',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const settings = await getSystemSettings()
  const user = session?.user as any // Type assertion for quick access to role/admin properties if needing detailed check

  // 1. Maintenance Mode Check
  // Allow if maintenance mode is OFF OR if user IS logged in AND (is admin OR is developer/mod)
  // For simplicity, let's just check if they are logged in for now, OR stricter check if we had isAdmin in session
  // But wait, session might not have isAdmin. "isAdmin" helper checks DB.
  // We can fetch user details or just rely on session.
  // Let's assume maintenance mode blocks EVERYONE except if we can verify admin status.
  // Since we don't have easy admin check here without DB call, let's do a simple check:
  // If maintenance mode is on, we show a screen. But we need a way for admins to login!
  // If they are already logged in, we can let them pass if they are admin.

  // Re-fetching full user to check admin status for maintenance bypass is safer
  // But for now, let's block if maintenance is on and NO session.
  // If session exists, we trust they might be staff (or we should check). 
  // BETTER: If maintenance is on, show maintenance page UNLESS path is /login or /admin (middleware handles admin auth).
  // But we are in layout.

  const isMaintenanceOn = settings.maintenance_mode

  // We need to allow login page even in maintenance mode so admins can get in.
  // But Layout wraps everything.
  // We can't easily check pathname in Server Component Layout without headers().
  // Using headers to getting pathname is opt-in and might de-opt static generation.
  // Valid strategy: Render maintenance overlay.

  // Let's implement a simple blocker:
  // If Maintenance Mode = ON:
  //   If User is Admin -> Allow
  //   Else -> Show Maintenance Screen

  // Maintenance Mode Logic
  // We use the client component MaintenanceGuard to handle the blocking
  // We allow bypass if user is admin/developer
  let isAdminUser = false
  if (session?.user?.email) {
    try {
      const { prisma } = await import('@/lib/prisma')
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { isAdmin: true, role: true }
      })
      if (dbUser?.isAdmin || dbUser?.role === 'admin' || dbUser?.role === 'developer') {
        isAdminUser = true
      }
    } catch (e) {
      console.error("Error checking admin status in layout", e)
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} suppressHydrationWarning>
        <MaintenanceGuard isOn={settings.maintenance_mode} isBypassed={isAdminUser}>
          <Providers session={session as Session | null}>
            {(!settings.public_view && !session) ? (
              <PublicAccessBlocker>
                {children}
              </PublicAccessBlocker>
            ) : (
              <>
                <LanguageInitializer />
                <div className="relative flex min-h-screen flex-col">
                  <header className="sticky top-0 z-40 border-b bg-background">
                    <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between py-4">
                      <Navbar />
                    </div>
                  </header>
                  {session?.user ? <MobileLoggedInNav user={session.user} /> : <MobileNav />}
                  <main className="flex-1">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      {children}
                    </div>
                  </main>
                  <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SiteFooter />
                    <RTAInformation />
                    <LanguageNotification />
                    <ScrollNavigationButtons />
                  </div>
                </div>
                <Toaster richColors position="top-center" />
              </>
            )}
          </Providers>
        </MaintenanceGuard>
      </body>
    </html>
  )
}

import { PublicAccessBlocker } from './public-access-blocker'
import { MaintenanceGuard } from './maintenance-guard'
