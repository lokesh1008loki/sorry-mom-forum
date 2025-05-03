'use client'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/contexts/language-context"

export function LatestPosts() {
  // Use translations
  const latestPostsTitle = useTranslation("latest_posts")
  const recentActivityDesc = useTranslation("recent_activity")
  const newTag = useTranslation("new_tag")
  const hotTag = useTranslation("hot_tag")
  const byText = useTranslation("by")
  const viewText = useTranslation("view")
  const viewsText = useTranslation("views")
  const momentAgoText = useTranslation("moment_ago")
  const minuteAgoText = useTranslation("minute_ago")

  const posts = [
    {
      id: 1,
      title: "New OnlyFans Leaks",
      author: {
        name: "User1",
        avatar: "/diverse-avatars.png",
      },
      category: "OnlyFans",
      time: momentAgoText,
      views: 7,
      isNew: true,
      isHot: false,
    },
    {
      id: 2,
      title: "FULL UP-TO-DATE ONLYFANS LEAKS",
      author: {
        name: "User2",
        avatar: "/diverse-avatars.png",
      },
      category: "OnlyFans",
      time: momentAgoText,
      views: 11,
      isNew: false,
      isHot: true,
    },
    {
      id: 3,
      title: "NEW BULK TEENAGER HIGH SCHOOL BULK PACK",
      author: {
        name: "User3",
        avatar: "/diverse-avatars.png",
      },
      category: "Snapchat",
      time: momentAgoText,
      views: 1,
      isNew: true,
      isHot: true,
    },
    {
      id: 4,
      title: "OnlyFans LEAK!!!",
      author: {
        name: "User4",
        avatar: "/diverse-avatars.png",
      },
      category: "OnlyFans",
      time: minuteAgoText,
      views: 14,
      isNew: false,
      isHot: false,
    },
    {
      id: 5,
      title: "OnlyFans leaks - 12 GB [MEGA]",
      author: {
        name: "User5",
        avatar: "/diverse-avatars.png",
      },
      category: "OnlyFans",
      time: minuteAgoText,
      views: 7,
      isNew: false,
      isHot: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{latestPostsTitle}</CardTitle>
        <CardDescription>{recentActivityDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="group">
              <Link
                href={`/posts/${post.id}`}
                className="block p-3 -mx-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <div className="flex gap-1 flex-wrap">
                        {post.isNew && (
                          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-xs">
                            {newTag}
                          </Badge>
                        )}
                        {post.isHot && (
                          <Badge variant="default" className="bg-red-500 hover:bg-red-600 text-xs">
                            {hotTag}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground flex-wrap">
                      <span className="truncate">
                        {byText} {post.author.name}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="truncate">{post.category}</span>
                      <span className="mx-1">•</span>
                      <span className="truncate">{post.time}</span>
                      <span className="mx-1">•</span>
                      <span className="truncate">
                        {post.views} {post.views === 1 ? viewText : viewsText}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
