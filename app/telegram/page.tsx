
"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type TelegramChannel = {
  id: string
  name: string
  url: string
  description?: string
  priority: number
  iconUrl?: string
}

export default function TelegramPage() {
  const [channels, setChannels] = useState<TelegramChannel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch("/api/telegram-channels")
        if (!res.ok) throw new Error("Failed to fetch channels")
        const data = await res.json()
        setChannels(data)
      } catch (error) {
        console.error("Error fetching channels:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannels()
  }, [])

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
          Join Our Telegram Community
        </h1>
        <p className="text-muted-foreground text-lg">
          Stay updated with the latest content, announcements, and exclusive leaks.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {channels.length > 0 ? (
            channels.map((channel) => (
              <a
                key={channel.id}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-blue-500/50 bg-card/50 backdrop-blur">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      {channel.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={channel.iconUrl}
                          alt={channel.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-blue-500"
                        >
                          <path d="M22 2L11 13" />
                          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
                          {channel.name}
                        </h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                      </div>
                      {channel.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {channel.description}
                        </p>
                      )}

                      {channel.priority > 50 && (
                        <Badge variant="outline" className="mt-3 border-yellow-500/50 text-yellow-500 bg-yellow-500/10">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
              No active channels at the moment. Check back soon!
            </div>
          )}
        </div>
      )}
    </div>
  )
}