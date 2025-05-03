import { LiveSites } from "@/components/ui/live-sites"

export default function LivePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Live Streaming</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Discover the best live streaming platforms. Each site is carefully selected
        and managed through our admin panel to ensure quality and reliability.
      </p>
      <LiveSites />
    </div>
  )
} 