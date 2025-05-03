'use client'

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/contexts/language-context"
import { ExternalLink } from "lucide-react"

export function NetworkSidebar() {
  // Use translations
  const networkTitle = useTranslation("network")
  const relatedSitesDesc = useTranslation("related_sites")
  const sexyEgirlsText = useTranslation("sexy_egirls")
  const thotbookText = useTranslation("thotbook")
  const famousNudesText = useTranslation("famous_nudes")
  const cartoonPornText = useTranslation("cartoon_porn")
  const thotflixText = useTranslation("thotflix")
  const onlyfansLeaksText = useTranslation("onlyfans_leaks")

  const networks = [
    {
      title: sexyEgirlsText,
      href: "/network/egirls",
    },
    {
      title: thotbookText,
      href: "/network/thotbook",
    },
    {
      title: famousNudesText,
      href: "/network/famous-nudes",
    },
    {
      title: cartoonPornText,
      href: "/network/cartoon-porn",
    },
    {
      title: thotflixText,
      href: "/network/thotflix",
    },
    {
      title: onlyfansLeaksText,
      href: "/network/onlyfans-leaks",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{networkTitle}</CardTitle>
        <CardDescription>{relatedSitesDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {networks.map((network, index) => (
            <Link
              key={index}
              href={network.href}
              className="flex items-center gap-1 text-sm rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-70" />
              <span className="truncate">{network.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
