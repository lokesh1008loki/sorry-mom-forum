'use client'

import Link from "next/link"
import { Button } from './ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { MainNav } from "./main-nav"
import { LoggedInNavbar } from "./LoggedInNavbar"
import { MobileNav } from "./mobile-nav"
import { useSession } from "next-auth/react"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  console.log('Navbar session state:', { status, session })

  if (status === 'loading') {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse h-8 w-8 rounded-full bg-muted"></div>
          </div>
        </div>
      </header>
    )
  }

  if (status === 'authenticated' && session?.user) {
    return <LoggedInNavbar user={{
      username: session.user.username || '',
      email: session.user.email || '',
      isContributor: session.user.isContributor || false,
      profilePicture: session.user.profilePicture
    }} />
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Sign In
            </Button>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 