import { languages } from "@/contexts/language-context"

/**
 * Detects the user's preferred language from browser settings
 * @returns The language code that best matches the user's preference, or 'en' as fallback
 */
export function detectBrowserLanguage(): string {
  // Default to English if we can't detect the language
  const detectedLanguage = "en"

  try {
    if (typeof window !== "undefined" && window.navigator) {
      // Get browser languages (ordered by preference)
      const browserLanguages = navigator.languages || [
        navigator.language || (navigator as any).userLanguage || (navigator as any).browserLanguage || "en",
      ]

      // Try to find an exact match first
      for (const browserLang of browserLanguages) {
        const exactMatch = languages.find((lang) => lang.code.toLowerCase() === browserLang.toLowerCase())
        if (exactMatch) {
          return exactMatch.code
        }

        // Try to match the primary language code (e.g., 'en' from 'en-US')
        const primaryCode = browserLang.split("-")[0].toLowerCase()
        const primaryMatch = languages.find((lang) => lang.code.toLowerCase() === primaryCode)
        if (primaryMatch) {
          return primaryMatch.code
        }
      }

      // If no exact match, try to find a language with the same base code
      for (const browserLang of browserLanguages) {
        const baseCode = browserLang.split("-")[0].toLowerCase()

        // Find any language that starts with this base code
        const baseMatch = languages.find(
          (lang) => lang.code.toLowerCase() === baseCode || lang.code.toLowerCase().startsWith(baseCode + "-"),
        )

        if (baseMatch) {
          return baseMatch.code
        }
      }
    }
  } catch (error) {
    console.error("Error detecting browser language:", error)
  }

  return detectedLanguage
}

/**
 * Checks if the language has been set before
 * @returns boolean indicating if language preference exists
 */
export function hasLanguagePreference(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(localStorage.getItem("language"))
  } catch (error) {
    return false
  }
}
