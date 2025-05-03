"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, Home, Video, Tv, Send, Activity, Award, Users, Handshake } from "lucide-react"
import { Logo } from "@/components/logo"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/contexts/language-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState(0)
  const pathname = usePathname()

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
  const videosText = useTranslation("videos")
  const telegramText = useTranslation("telegram")
  const leaderboardText = useTranslation("leaderboard")
  const staffText = useTranslation("staff")
  const partnersText = useTranslation("partners")

  const routes = [
    {
      href: "/",
      label: homeText,
      icon: Home,
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
      icon: Tv,
      active: pathname === "/live",
    },
    {
      href: "/videos",
      label: videosText,
      icon: Video,
      active: pathname === "/videos",
    },
    {
      href: "/telegram",
      label: telegramText,
      icon: Send,
      active: pathname === "/telegram",
    },
    {
      href: "/activity",
      label: useTranslation("today_activity"),
      icon: Activity,
      active: pathname === "/activity",
    },
    {
      href: "/leaderboard",
      label: leaderboardText,
      icon: Award,
      active: pathname === "/leaderboard",
    },
    {
      href: "/staff",
      label: staffText,
      icon: Users,
      active: pathname === "/staff",
    },
    {
      href: "/partners",
      label: partnersText,
      icon: Handshake,
      active: pathname === "/partners",
    },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b md:hidden">
      <div className="flex items-center justify-between h-14 px-4 max-w-[100vw]">
        <div className="flex items-center gap-2">
      <ThemeSwitcher />
      <LanguageSelector />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link
            href="/live"
            className="flex items-center gap-1.5 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            {useTranslation("live_sex")}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
          </Link>
        </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
                  <Logo className="h-6 w-auto" />
          </Link>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7">
                  <span className="sr-only">Close menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col py-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                        "flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors",
                  route.active ? "bg-accent" : "",
                )}
              >
                      <route.icon className="h-4.5 w-4.5 flex-shrink-0" />
                      <span className="font-medium truncate">{route.label}</span>
              </Link>
            ))}
                </nav>
              </div>
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </div>
  )
}
