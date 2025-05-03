"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/contexts/language-context"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: "post" | "comment" | "reaction" | "thread"
  user: {
    id: string
    username: string
    avatar: string
  }
  content: string
  timestamp: Date
  threadTitle?: string
  reactionType?: string
}

export function TodayActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const newPostText = useTranslation("new_post")
  const newCommentText = useTranslation("new_comment")
  const newReactionText = useTranslation("new_reaction")
  const newThreadText = useTranslation("new_thread")

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchActivities = async () => {
      try {
        // Mock data for now
        const mockActivities: Activity[] = [
          {
            id: "1",
            type: "thread",
            user: {
              id: "1",
              username: "User1",
              avatar: "/avatars/user1.png",
            },
            content: "Started a new discussion",
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            threadTitle: "Best practices for forum moderation",
          },
          {
            id: "2",
            type: "post",
            user: {
              id: "2",
              username: "User2",
              avatar: "/avatars/user2.png",
            },
            content: "Shared their thoughts on community guidelines",
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          },
          {
            id: "3",
            type: "comment",
            user: {
              id: "3",
              username: "User3",
              avatar: "/avatars/user3.png",
            },
            content: "Great points! I agree with your suggestions",
            timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
          },
          {
            id: "4",
            type: "reaction",
            user: {
              id: "4",
              username: "User4",
              avatar: "/avatars/user4.png",
            },
            content: "Reacted to a post",
            timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            reactionType: "👍",
          },
        ]
        setActivities(mockActivities)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const getActivityTypeText = (type: Activity["type"]) => {
    switch (type) {
      case "post":
        return newPostText
      case "comment":
        return newCommentText
      case "reaction":
        return newReactionText
      case "thread":
        return newThreadText
      default:
        return ""
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
            >
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.username} />
                <AvatarFallback>
                  {activity.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{activity.user.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {getActivityTypeText(activity.type)}
                  </span>
                  {activity.reactionType && (
                    <span className="text-lg">{activity.reactionType}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.content}
                </p>
                {activity.threadTitle && (
                  <p className="text-sm font-medium mt-1">
                    Thread: {activity.threadTitle}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 