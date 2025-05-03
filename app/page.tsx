import { ForumCategories } from "@/components/forum-categories"
import { LatestPosts } from "@/components/latest-posts"
import { NetworkSidebar } from "@/components/network-sidebar"
import { ForumStats } from "@/components/forum-stats"
import { LiveChat } from "@/components/live-chat"
import { HeroSection } from "@/components/hero-section"
import { AdSpace } from "@/components/ad-space"

export default function HomePage() {
  return (
    <>
      <div className="container px-4 py-6 md:py-8">
        <HeroSection />

        {/* Ad Space between Hero and Content */}
        <AdSpace className="mb-6" />

        {/* Mobile view: Forum Categories followed by other components stacked vertically */}
        <div className="md:hidden space-y-6 mb-6">
          <ForumCategories />
          <LatestPosts />
          <LiveChat />
          <NetworkSidebar />
          <ForumStats />
        </div>

        {/* Desktop view: Two-column layout with Forum Categories on left and other components on right */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Left column: Forum Categories */}
          <div className="md:col-span-2 lg:col-span-3">
            <ForumCategories />
          </div>

          {/* Right column: Stacked components */}
          <div className="space-y-6">
            <NetworkSidebar />
            <ForumStats />
            <LiveChat />
            <LatestPosts />
          </div>
        </div>
      </div>

      {/* Ad Space between content and Footer */}
      <div className="container px-4 py-6">
        <AdSpace className="my-4" size="large" />
      </div>
    </>
  )
}
