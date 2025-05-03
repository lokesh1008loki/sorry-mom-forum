"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, User } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/contexts/language-context"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function UserAccountNav() {
  // This would be replaced with actual auth state
  const isLoggedIn = false

  // Use translations
  const loginText = useTranslation("login")
  const registerText = useTranslation("register")
  const profileText = useTranslation("profile")
  const settingsText = useTranslation("settings")
  const logoutText = useTranslation("logout")

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSelector />
        <Link href="/login">
          <Button variant="ghost" size="sm">
            {loginText}
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">{registerText}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <ThemeSwitcher />
      <LanguageSelector />
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">Username</p>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">{profileText}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">{settingsText}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout">{logoutText}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
