"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/contexts/language-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Partner {
  id: string
  name: string
  logo: string
  description: string
  website: string
  partnershipType: "sponsor" | "collaborator" | "affiliate"
  benefits: string[]
  joinDate: string
}

export function PartnersList() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  const sponsorText = useTranslation("sponsor")
  const collaboratorText = useTranslation("collaborator")
  const affiliateText = useTranslation("affiliate")
  const becomePartnerText = useTranslation("become_partner")
  const partnershipBenefitsText = useTranslation("partnership_benefits")

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPartners = async () => {
      try {
        // Mock data for now
        const mockPartners: Partner[] = [
          {
            id: "1",
            name: "Tech Solutions Inc.",
            logo: "/partners/tech-solutions.png",
            description: "Leading provider of forum software and hosting solutions",
            website: "https://techsolutions.com",
            partnershipType: "sponsor",
            benefits: [
              "Premium hosting services",
              "Technical support",
              "Custom development"
            ],
            joinDate: "2023-01-01"
          },
          {
            id: "2",
            name: "Community Builders",
            logo: "/partners/community-builders.png",
            description: "Experts in community management and growth",
            website: "https://communitybuilders.org",
            partnershipType: "collaborator",
            benefits: [
              "Community management training",
              "Growth strategies",
              "Moderation tools"
            ],
            joinDate: "2023-03-15"
          },
          {
            id: "3",
            name: "Content Creators Network",
            logo: "/partners/content-creators.png",
            description: "Network of professional content creators",
            website: "https://contentcreators.net",
            partnershipType: "affiliate",
            benefits: [
              "Exclusive content",
              "Creator partnerships",
              "Content guidelines"
            ],
            joinDate: "2023-02-01"
          }
        ]
        setPartners(mockPartners)
      } catch (error) {
        console.error("Error fetching partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const getPartnershipTypeText = (type: Partner["partnershipType"]) => {
    switch (type) {
      case "sponsor":
        return sponsorText
      case "collaborator":
        return collaboratorText
      case "affiliate":
        return affiliateText
      default:
        return ""
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner: Partner) => (
          <Card key={partner.id} className="flex flex-col">
            <CardHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-24 w-24">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <CardTitle className="text-xl">{partner.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getPartnershipTypeText(partner.partnershipType)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Partner since: {new Date(partner.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {partner.description}
                </p>
                <div>
                  <h4 className="font-medium mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {partner.benefits.map((benefit: string, index: number) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline block"
                >
                  Visit Website →
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Become Partner Section */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Become Our Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Join our network of partners and help us build a better community together.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Sponsorship</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Brand visibility</li>
                  <li>Direct community access</li>
                  <li>Custom partnership benefits</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Collaboration</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Joint initiatives</li>
                  <li>Resource sharing</li>
                  <li>Cross-promotion</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Affiliation</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Content partnerships</li>
                  <li>Referral programs</li>
                  <li>Community integration</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button size="lg" className="w-full md:w-auto">
                Apply for Partnership
              </Button>
              <p className="text-sm text-muted-foreground">
                Our team will review your application and get back to you within 48 hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 