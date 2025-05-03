'use client'

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useTranslation } from "@/contexts/language-context"

export function HeroSection() {
  const welcomeText = useTranslation("welcome")
  const joinCommunityText = useTranslation("join_community")
  const searchText = useTranslation("search")
  const newPostText = useTranslation("new_post")

  return (
    <div className="relative mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">{welcomeText}</h1>
        <p className="mb-6 text-lg opacity-90 max-w-xl mx-auto">{joinCommunityText}</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-white/70" />
            </div>
            <input
              type="text"
              placeholder={searchText}
              className="w-full rounded-lg bg-white/20 py-3 pl-10 pr-4 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <Button className="w-full sm:w-auto" variant="secondary" size="lg">
            {newPostText}
          </Button>
        </div>
      </div>
    </div>
  )
}
