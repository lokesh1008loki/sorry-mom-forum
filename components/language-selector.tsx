"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LanguageSelector() {
  const { currentLanguage, languages, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [key, setKey] = useState(0) // Force re-render key

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true)

    // Listen for language updates to force re-render
    const handleLanguageUpdate = () => {
      setKey((prev) => prev + 1)
    }

    window.addEventListener("languageUpdate", handleLanguageUpdate)

    return () => {
      window.removeEventListener("languageUpdate", handleLanguageUpdate)
    }
  }, [])

  // Group languages by region for better organization
  const languageGroups = {
    popular: ["en", "es", "fr", "de", "zh-CN", "ar", "ru", "ja"],
    european: ["it", "pt", "nl", "el", "pl", "cs", "hu", "ro", "sk", "sr", "hr", "bg", "fi", "sv", "no", "da", "uk"],
    asian: ["zh-TW", "hi", "bn", "ko", "vi", "th", "id", "ms", "my", "km", "ne", "si"],
    other: ["ur", "tr", "fa", "tl", "sw", "he", "ms-MY"],
  }

  // Handle language selection
  const handleSelectLanguage = (code: string) => {
    setLanguage(code)
    setOpen(false)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <Globe className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} key={key}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{currentLanguage.code.toUpperCase()}</span>
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Current: {currentLanguage.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-72">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Popular</DropdownMenuLabel>
            {languageGroups.popular.map((code) => {
              const language = languages.find((lang) => lang.code === code)
              if (!language) return null
              return (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleSelectLanguage(language.code)}
                  className={language.code === currentLanguage.code ? "bg-accent" : ""}
                >
                  <span>{language.name}</span>
                  {language.code === currentLanguage.code && (
                    <span className="ml-auto">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">All Languages</DropdownMenuLabel>
            {languages
              .filter((lang) => !languageGroups.popular.includes(lang.code))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleSelectLanguage(language.code)}
                  className={language.code === currentLanguage.code ? "bg-accent" : ""}
                >
                  <span>{language.name}</span>
                  {language.code === currentLanguage.code && (
                    <span className="ml-auto">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
