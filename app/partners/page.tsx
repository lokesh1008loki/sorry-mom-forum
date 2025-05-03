import { PartnersList } from "@/components/ui/partners-list"

export default function PartnersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Our Partners</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        We're proud to collaborate with industry leaders and innovative organizations
        that help us provide the best experience for our community members.
      </p>
      <PartnersList />
    </div>
  )
} 