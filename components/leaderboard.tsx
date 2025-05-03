"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/contexts/language-context"

interface LeaderboardUser {
  id: string
  username: string
  avatar: string
  score: number
  posts: number
  comments: number
  reactions: number
  rank: number
}

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  const topContributorsText = useTranslation("top_contributors")
  const postsText = useTranslation("posts")
  const commentsText = useTranslation("comments")
  const reactionsText = useTranslation("reactions")

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchLeaderboard = async () => {
      try {
        // Mock data for now
        const mockUsers: LeaderboardUser[] = [
          {
            id: "1",
            username: "User1",
            avatar: "/avatars/user1.png",
            score: 1500,
            posts: 50,
            comments: 200,
            reactions: 300,
            rank: 1,
          },
          {
            id: "2",
            username: "User2",
            avatar: "/avatars/user2.png",
            score: 1200,
            posts: 40,
            comments: 150,
            reactions: 250,
            rank: 2,
          },
          {
            id: "3",
            username: "User3",
            avatar: "/avatars/user3.png",
            score: 1000,
            posts: 30,
            comments: 100,
            reactions: 200,
            rank: 3,
          },
        ]
        setUsers(mockUsers)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{topContributorsText}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-primary">
                  #{user.rank}
                </div>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-sm text-muted-foreground">
                    Score: {user.score}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>
                  {postsText}: {user.posts}
                </div>
                <div>
                  {commentsText}: {user.comments}
                </div>
                <div>
                  {reactionsText}: {user.reactions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 