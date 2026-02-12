import { ForumCategories } from "@/components/forum-categories"
import { LatestPosts } from "@/components/latest-posts"
import { NetworkSidebar } from "@/components/network-sidebar"
import { ForumStats } from "@/components/forum-stats"
import { LiveChat } from "@/components/live-chat"
import { HeroSection } from "@/components/hero-section"
import { AdSpace } from "@/components/ad-space"
import { getSession } from '@/lib/auth'
import { UserProfile } from '@/components/UserProfile'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const session = await getSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to Sorry Mom Forum
        </p>
        <div className="fixed right-0 top-0 flex w-full justify-end p-4">
          {session ? (
            <UserProfile user={session} />
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="container px-4 py-6 md:py-8">
        <HeroSection />

        {/* Ad Space between Hero and Content */}
        <AdSpace className="mb-6" />

        {/* Mobile view: Forum Categories followed by other components stacked vertically */}
        <div className="md:hidden space-y-6 mb-6">
          <ForumCategories />
          <LatestPosts />
          <LiveChat user={session} className="w-full" />
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
            <LiveChat user={session} className="w-full" />
            <LatestPosts />
          </div>
        </div>
      </div>

      {/* Ad Space between content and Footer */}
      <div className="container px-4 py-6">
        <AdSpace className="my-4" size="large" />
      </div>
    </main>
  )
}
