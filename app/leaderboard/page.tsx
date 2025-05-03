import { Leaderboard } from "@/components/ui/leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Top Contributors</h1>
      <Leaderboard />
    </div>
  )
} 