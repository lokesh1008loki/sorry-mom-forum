"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/contexts/language-context"
import { hasLanguagePreference } from "@/lib/language-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X } from "lucide-react"

export function LanguageNotification() {
  const { currentLanguage } = useLanguage()
  const [showNotification, setShowNotification] = useState(false)
  const autoDetectedText = useTranslation("auto_detected")
  const languageChangedText = useTranslation("language_changed")

  useEffect(() => {
    // Only show notification on first visit (when language is auto-detected)
    const isFirstVisit = !hasLanguagePreference()

    if (isFirstVisit) {
      setShowNotification(true)

      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!showNotification) {
    return null
  }

  return (
    <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-primary/10 border-primary/20">
      <div className="flex items-center justify-between">
        <AlertDescription className="text-sm">
          <span className="font-medium">{autoDetectedText}:</span> {languageChangedText} {currentLanguage.name}
        </AlertDescription>
        <button onClick={() => setShowNotification(false)} className="ml-2 p-1 rounded-full hover:bg-primary/20">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </Alert>
  )
}
