"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { useTranslation } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeSelector } from "@/components/theme-selector"

export function MainNav() {
  const pathname = usePathname()
  const [key, setKey] = useState(0) // Force re-render key

  // Listen for language updates to force re-render
  useEffect(() => {
    const handleLanguageUpdate = () => {
      setKey((prev) => prev + 1)
    }

    window.addEventListener("languageUpdate", handleLanguageUpdate)

    return () => {
      window.removeEventListener("languageUpdate", handleLanguageUpdate)
    }
  }, [])

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
    <div className="flex items-center gap-6 md:gap-8" key={key}>
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
      <div className="flex items-center space-x-2">
        <ThemeSelector />
        <LanguageSelector />
      </div>
    </div>
  )
}
