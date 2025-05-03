"use client"

import { useEffect, useState } from "react"
import { PinnedLink } from "@/types/pinned-links"

export default function TelegramPage() {
  const [pinnedLinks, setPinnedLinks] = useState<PinnedLink[]>([])

  useEffect(() => {
    // TODO: Replace with actual API call to fetch pinned links
    const fetchPinnedLinks = async () => {
      try {
        // Mock data for now
        const mockPinnedLinks: PinnedLink[] = [
          {
            id: "1",
            url: "https://t.me/sorrymom_premium",
            title: "Premium Channel",
            pinnedBy: "admin",
            pinnedAt: "2024-03-15",
            type: "telegram"
          },
          {
            id: "2",
            url: "https://t.me/sorrymom_announcements",
            title: "Announcements",
            pinnedBy: "moderator",
            pinnedAt: "2024-03-14",
            type: "telegram"
          }
        ]
        setPinnedLinks(mockPinnedLinks)
      } catch (error) {
        console.error("Error fetching pinned links:", error)
      }
    }

    fetchPinnedLinks()
  }, [])

  return (
    <div className="container mx-auto py-8">
      {pinnedLinks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pinned Links</h2>
          <div className="space-y-2">
            {pinnedLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {link.title}
                </a>
                <span className="text-sm text-muted-foreground">
                  (Pinned by {link.pinnedBy})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <a 
        href="https://t.me/sorrymom" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        https://t.me/sorrymom
      </a>
    </div>
  )
} 