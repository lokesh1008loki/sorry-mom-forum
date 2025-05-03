"use client"

import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/contexts/language-context"
import { Globe } from "lucide-react"

export function LanguageDisplay() {
  const { currentLanguage } = useLanguage()
  const languageText = useTranslation("language")

  return (
    <div className="text-sm text-muted-foreground flex items-center gap-1">
      <Globe className="h-3 w-3" />
      <span>{currentLanguage.name}</span>
    </div>
  )
}
