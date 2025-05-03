"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"

export function ScrollNavigationButtons() {
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    // Show buttons after scrolling a bit
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButtons(true)
      } else {
        setShowButtons(false)
      }
    }

    // Initial check in case page is already scrolled
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    // For better mobile compatibility
    try {
      // First try the smooth behavior
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0)
    }
  }

  const scrollToBottom = () => {
    try {
      // First try the smooth behavior
      window.scrollTo({
        top: document.documentElement.scrollHeight || document.body.scrollHeight,
        behavior: "smooth",
      })
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight)
    }
  }

  if (!showButtons) return null

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 flex flex-col gap-3 z-[100]">
      <Button
        onClick={scrollToTop}
        size="icon"
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 touch-manipulation"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
      <Button
        onClick={scrollToBottom}
        size="icon"
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 touch-manipulation"
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </div>
  )
}
