"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/contexts/language-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LiveSite {
  id: string
  name: string
  logo: string
  description: string
  url: string
  isActive: boolean
  category: "premium" | "free" | "exclusive"
  rating: number
  features: string[]
  lastUpdated: string
}

export function LiveSites() {
  const [sites, setSites] = useState<LiveSite[]>([])
  const [loading, setLoading] = useState(true)

  const premiumText = useTranslation("premium")
  const freeText = useTranslation("free")
  const exclusiveText = useTranslation("exclusive")

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchSites = async () => {
      try {
        // Mock data for now
        const mockSites: LiveSite[] = [
          {
            id: "1",
            name: "Premium Live Cams",
            logo: "/live-sites/premium-cams.png",
            description: "High-quality live streaming with professional models",
            url: "https://premium-live-cams.com",
            isActive: true,
            category: "premium",
            rating: 4.8,
            features: [
              "HD Quality",
              "Private Shows",
              "Multiple Models",
              "24/7 Support"
            ],
            lastUpdated: "2024-03-01"
          },
          {
            id: "2",
            name: "Free Live Chat",
            logo: "/live-sites/free-chat.png",
            description: "Free live chat rooms with amateur models",
            url: "https://free-live-chat.com",
            isActive: true,
            category: "free",
            rating: 4.2,
            features: [
              "Free Access",
              "Group Chats",
              "Basic Features",
              "Community Driven"
            ],
            lastUpdated: "2024-02-15"
          },
          {
            id: "3",
            name: "Exclusive Shows",
            logo: "/live-sites/exclusive.png",
            description: "Exclusive content and private shows",
            url: "https://exclusive-shows.com",
            isActive: true,
            category: "exclusive",
            rating: 4.9,
            features: [
              "VIP Access",
              "Custom Shows",
              "Premium Models",
              "Personal Assistant"
            ],
            lastUpdated: "2024-03-05"
          }
        ]
        setSites(mockSites)
      } catch (error) {
        console.error("Error fetching live sites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [])

  const getCategoryText = (category: LiveSite["category"]) => {
    switch (category) {
      case "premium":
        return premiumText
      case "free":
        return freeText
      case "exclusive":
        return exclusiveText
      default:
        return ""
    }
  }

  const handleRedirect = (url: string) => {
    // TODO: Add tracking/analytics before redirect
    window.open(url, "_blank")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sites.map((site: LiveSite) => (
        <Card key={site.id} className="flex flex-col">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-24 w-24">
                <Image
                  src={site.logo}
                  alt={site.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <CardTitle className="text-xl">{site.name}</CardTitle>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant={site.category === "premium" ? "default" : "secondary"}>
                    {getCategoryText(site.category)}
                  </Badge>
                  <Badge variant="outline">
                    {site.rating} ★
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {site.description}
              </p>
              <div>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {site.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => handleRedirect(site.url)}
                  className="w-full"
                >
                  Visit Site
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Last updated: {new Date(site.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 