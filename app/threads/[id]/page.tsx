import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ThumbsUp, Flag, Share2, Reply } from "lucide-react"

interface ThreadPageProps {
  params: {
    id: string;
  };
}

export default function ThreadPage({ params }: ThreadPageProps) {
  const { id } = params

  // This would be replaced with actual data fetching
  const thread = {
    id,
    title: "Welcome to the new forum design",
    category: {
      id: "announcements",
      title: "Announcements",
    },
    author: {
      id: 1,
      name: "Admin",
      avatar: "/diverse-avatars.png",
      joinDate: "Jan 2020",
      posts: 1240,
    },
    content: `
      <p>Welcome to our newly redesigned forum!</p>
      <p>We've made significant improvements to enhance your experience:</p>
      <ul>
        <li>Modern, responsive design that works on all devices</li>
        <li>Improved navigation and search functionality</li>
        <li>Enhanced user profiles and notification system</li>
        <li>Better media embedding and sharing options</li>
      </ul>
      <p>Please let us know if you have any feedback or encounter any issues.</p>
    `,
    createdAt: "April 25, 2023",
    replies: [
      {
        id: 1,
        author: {
          id: 2,
          name: "User123",
          avatar: "/diverse-group-avatars.png",
          joinDate: "Mar 2021",
          posts: 342,
        },
        content: "The new design looks great! Much easier to navigate now.",
        createdAt: "April 25, 2023",
        likes: 5,
      },
      {
        id: 2,
        author: {
          id: 3,
          name: "ForumFan",
          avatar: "/diverse-group-avatars.png",
          joinDate: "Sep 2022",
          posts: 87,
        },
        content: "I'm loving the dark mode and the improved mobile experience. Great job on the redesign!",
        createdAt: "April 26, 2023",
        likes: 3,
      },
    ],
    views: 120,
  }

  // Add more mock replies
  for (let i = 3; i <= 8; i++) {
    thread.replies.push({
      id: i,
      author: {
        id: i + 2,
        name: `User${i + 100}`,
        avatar: `/placeholder.svg?height=40&width=40&query=avatar${i}`,
        joinDate: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(Math.random() * 12)]} ${2020 + Math.floor(Math.random() * 4)}`,
        posts: Math.floor(Math.random() * 1000),
      },
      content: `This is reply #${i} to the thread. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`,
      createdAt: `April ${25 + Math.floor(Math.random() * 5)}, 2023`,
      likes: Math.floor(Math.random() * 10),
    })
  }

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/forums" className="hover:text-primary">
          Forums
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/forums/${thread.category.id}`} className="hover:text-primary">
          {thread.category.title}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{thread.title}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{thread.title}</h1>
        <p className="text-muted-foreground">Thread in {thread.category.title}</p>
      </div>

      <div className="space-y-6">
        <Card id={`post-${thread.id}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
                <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{thread.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  Joined {thread.author.joinDate} • {thread.author.posts} posts
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{thread.createdAt}</p>
          </CardHeader>
          <CardContent>
            <div
              dangerouslySetInnerHTML={{ __html: thread.content }}
              className="prose prose-sm dark:prose-invert max-w-none"
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Replies ({thread.replies.length})</h2>
          <Button>Post Reply</Button>
        </div>

        <div className="space-y-4">
          {thread.replies.map((reply) => (
            <Card key={reply.id} id={`reply-${reply.id}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                    <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{reply.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {reply.author.joinDate} • {reply.author.posts} posts
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{reply.createdAt}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reply.content}</p>
              </CardContent>
              <CardFooter className="border-t px-6 py-3">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{reply.likes > 0 ? reply.likes : "Like"}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Badge variant="outline">{thread.replies.length} replies</Badge>
                <Badge variant="outline">{thread.views} views</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
