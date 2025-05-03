"use client"

import { useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"

export function LanguageInitializer() {
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    // Set the HTML dir attribute for RTL languages
    if (currentLanguage.direction === "rtl") {
      document.documentElement.dir = "rtl"
    } else {
      document.documentElement.dir = "ltr"
    }

    // Set the HTML lang attribute
    document.documentElement.lang = currentLanguage.code

    // Log language change
    console.log(`Language initialized: ${currentLanguage.name} (${currentLanguage.code})`)

    // Handle language change event
    const handleLanguageChange = (event: CustomEvent) => {
      console.log(`Language changed to: ${event.detail}`)

      // Force a re-render of components that use translations
      // This is a workaround to ensure all components update when language changes
      const event2 = new Event("languageUpdate")
      window.dispatchEvent(event2)
    }

    // Add event listener for language changes
    window.addEventListener("languageChanged", handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange as EventListener)
    }
  }, [currentLanguage])

  return null
}
