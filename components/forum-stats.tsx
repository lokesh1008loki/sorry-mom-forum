'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Clock } from "lucide-react"
import { useTranslation } from "@/contexts/language-context"

export function ForumStats() {
  // Use translations
  const forumStatisticsTitle = useTranslation("forum_statistics")
  const communityMetricsDesc = useTranslation("community_metrics")
  const membersText = useTranslation("members")
  const totalPostsText = useTranslation("total_posts")
  const latestMemberText = useTranslation("latest_member")

  // Format large numbers to be more compact
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{forumStatisticsTitle}</CardTitle>
        <CardDescription>{communityMetricsDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5">
            <Users className="h-6 w-6 text-primary mb-1" />
            <p className="text-xs font-medium text-center">{membersText}</p>
            <p className="text-lg sm:text-xl font-bold">{formatNumber(1764855)}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5">
            <MessageSquare className="h-6 w-6 text-primary mb-1" />
            <p className="text-xs font-medium text-center">{totalPostsText}</p>
            <p className="text-lg sm:text-xl font-bold">{formatNumber(4372967)}</p>
          </div>
          <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-center p-3 rounded-lg bg-primary/5">
            <Clock className="h-6 w-6 text-primary mb-1 sm:mb-0 sm:mr-3" />
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium">{latestMemberText}</p>
              <p className="text-sm font-medium">
                User123 <span className="text-xs text-muted-foreground">5 minutes ago</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
