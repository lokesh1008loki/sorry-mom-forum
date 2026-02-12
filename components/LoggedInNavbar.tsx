"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { useTranslation } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeSelector } from "@/components/theme-selector"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"

interface LoggedInNavbarProps {
  user: {
    username: string
    email: string
    isContributor: boolean
    profilePicture?: string | null
  }
}

export function LoggedInNavbar({ user: initialUser }: LoggedInNavbarProps) {
  console.log('LoggedInNavbar props:', {
    initialUser,
    hasUsername: !!initialUser?.username,
    hasEmail: !!initialUser?.email,
    isContributor: initialUser?.isContributor,
    hasProfilePicture: !!initialUser?.profilePicture
  })

  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<LoggedInNavbarProps['user']>(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(initialUser.profilePicture || null)

  useEffect(() => {
    console.log('LoggedInNavbar mounted with user:', {
      username: user?.username,
      email: user?.email,
      isContributor: user?.isContributor,
      profilePicture: user?.profilePicture
    })
    // Only handle profile picture updates
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.profilePicture) {
        console.log('Profile picture updated:', customEvent.detail.profilePicture)
        setProfilePicture(customEvent.detail.profilePicture)
        setUser(prev => ({ ...prev, profilePicture: customEvent.detail.profilePicture }))
      }
    }

    window.addEventListener('profile-updated', handleProfileUpdate)

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate)
    }
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      
      // First sign out from Firebase
      if (auth.currentUser) {
        await auth.signOut()
      }

      // Then handle NextAuth logout
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      toast.success('Logged out successfully')
      
      // Force a hard refresh to clear all states
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  // Use translations for navigation items
  const homeText = useTranslation("home")
  const liveText = useTranslation("live")
  const videosText = useTranslation("videos")
  const telegramText = useTranslation("telegram")
  const activityText = useTranslation("activity")
  const leaderboardText = useTranslation("leaderboard")
  const staffText = useTranslation("staff")
  const partnersText = useTranslation("partners")

  const routes = [
    {
      href: "/",
      label: homeText,
      active: pathname === "/",
    },
    {
      href: "/live",
      label: (
        <div className="flex items-center gap-1.5">
          {useTranslation("live_sex")}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
        </div>
      ),
      active: pathname === "/live",
    },
    {
      href: "/videos",
      label: videosText,
      active: pathname === "/videos",
    },
    {
      href: "/telegram",
      label: telegramText,
      active: pathname === "/telegram",
    },
    {
      href: "/activity",
      label: useTranslation("today_activity"),
      active: pathname === "/activity",
    },
    {
      href: "/leaderboard",
      label: leaderboardText,
      active: pathname === "/leaderboard",
    },
    {
      href: "/staff",
      label: staffText,
      active: pathname === "/staff",
    },
    {
      href: "/partners",
      label: partnersText,
      active: pathname === "/partners",
    },
  ]

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6 md:gap-8">
        <Link href="/" className="hidden md:flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 overflow-x-auto">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
                route.active ? "text-primary font-semibold" : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <ThemeSelector />
          <LanguageSelector />
        </div>
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          onClick={handleLogout}
        >
          Logout
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={profilePicture || `https://avatar.vercel.sh/${user?.email}`} 
                  alt={user?.username}
                  onError={(e) => {
                    // If the profile picture fails to load, fall back to the Vercel avatar
                    const target = e.target as HTMLImageElement
                    target.src = `https://avatar.vercel.sh/${user?.email}`
                  }}
                />
                <AvatarFallback>{getInitials(user?.username || '')}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              Profile
            </DropdownMenuItem>
            {user?.isContributor && (
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                Dashboard
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 