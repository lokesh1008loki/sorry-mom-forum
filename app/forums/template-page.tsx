"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Heart, MessageSquare, Filter, ChevronDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CategoryInfo {
  title: string
  description: string
  parent?: string
}

interface Thread {
  id: number
  title: string
  author: {
    name: string
    avatar: string
  }
  date: string
  replies: number
  views: number
  likes: number
  lastReply: {
    author: string
    avatar: string
    date: string
  }
  isPinned: boolean
  isLocked: boolean
  isHot: boolean
  isNew: boolean
  thumbnail: string
}

type SortOption = "latest" | "oldest" | "most-viewed" | "most-replies" | "recently-active" | "most-liked"

interface TemplatePageProps {
  categoryData: CategoryInfo
  breadcrumbs: { name: string; href: string }[]
  threads: Thread[]
}

export default function TemplatePage({ categoryData, breadcrumbs, threads }: TemplatePageProps) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [sortOption, setSortOption] = useState<SortOption>("latest")

  // Function to sort threads based on selected option
  function sortThreads(threads: Thread[], option: SortOption): Thread[] {
    return [...threads].sort((a, b) => {
      switch (option) {
        case "latest":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "most-viewed":
          return b.views - a.views
        case "most-replies":
          return b.replies - a.replies
        case "most-liked":
          return b.likes - a.likes
        case "recently-active":
          return new Date(b.lastReply.date).getTime() - new Date(a.lastReply.date).getTime()
        default:
          return 0
      }
    })
  }

  // Apply sorting to the filtered threads
  const sortedThreads = sortThreads(threads, sortOption)

  return (
    <div className="container py-6">
      {/* Top Advertisement - 728x90 */}
      <div className="mb-6 bg-muted/50 rounded-lg p-4 flex items-center justify-center min-h-[90px] w-full max-w-[728px] mx-auto border-2 border-dashed border-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-bold text-muted-foreground">ADVERTISEMENT</p>
          <p className="text-sm text-muted-foreground">728 x 90</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground">{crumb.name}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-primary">
                {crumb.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Category Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{categoryData.title}</h1>
            <p className="text-muted-foreground">{categoryData.description}</p>
          </div>
          <Button>Post Thread</Button>
        </div>
      </div>

      {/* Middle Advertisement - 728x90 */}
      <div className="mb-6 bg-muted/50 rounded-lg p-4 flex items-center justify-center min-h-[90px] w-full max-w-[728px] mx-auto border-2 border-dashed border-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-bold text-muted-foreground">ADVERTISEMENT</p>
          <p className="text-sm text-muted-foreground">728 x 90</p>
        </div>
      </div>

      {/* Forum Content */}
      <Card className="overflow-hidden">
        {/* Tabs and Filters */}
        <div className="flex items-center justify-between border-b p-3">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-3">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="hot">Hot</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="h-4 w-4 mr-1" />
                      {sortOption === "latest" && "Latest Threads"}
                      {sortOption === "oldest" && "Oldest Threads"}
                      {sortOption === "most-viewed" && "Most Viewed"}
                      {sortOption === "most-replies" && "Most Replies"}
                      {sortOption === "most-liked" && "Most Liked"}
                      {sortOption === "recently-active" && "Recently Active"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setSortOption("latest")}
                      className={sortOption === "latest" ? "bg-accent" : ""}
                    >
                      Latest Threads
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("oldest")}
                      className={sortOption === "oldest" ? "bg-accent" : ""}
                    >
                      Oldest Threads
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("most-viewed")}
                      className={sortOption === "most-viewed" ? "bg-accent" : ""}
                    >
                      Most Viewed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("most-replies")}
                      className={sortOption === "most-replies" ? "bg-accent" : ""}
                    >
                      Most Replies
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("most-liked")}
                      className={sortOption === "most-liked" ? "bg-accent" : ""}
                    >
                      Most Liked
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("recently-active")}
                      className={sortOption === "recently-active" ? "bg-accent" : ""}
                    >
                      Recently Active
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="default" size="sm" className="h-8">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Post Thread
                </Button>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {sortedThreads.map((thread) => (
            <Link key={thread.id} href={`/threads/${thread.id}`}>
              <Card className="group relative overflow-hidden rounded-lg">
                {/* Image */}
                <div className="aspect-[5/3] relative">
                  <img
                    src={thread.thumbnail}
                    alt={thread.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Thread Info */}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={thread.author.avatar}
                      alt={thread.author.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-sm font-medium">{thread.author.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{thread.title}</p>
                  
                  {/* Status Tags */}
                  <div className="flex items-center gap-1 mb-2">
                    {thread.isHot && (
                      <Badge variant="outline" className="border-orange-500 text-orange-500 text-[10px] h-4">
                        Hot
                      </Badge>
                    )}
                    {thread.isNew && (
                      <Badge variant="outline" className="border-green-500 text-green-500 text-[10px] h-4">
                        New
                      </Badge>
                    )}
                    {thread.isPinned && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-[10px] h-4">
                        Pinned
                      </Badge>
                    )}
                    {thread.isLocked && (
                      <Badge variant="outline" className="border-red-500 text-red-500 text-[10px] h-4">
                        Locked
                      </Badge>
                    )}
                  </div>

                  {/* Stats and Time */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{thread.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{thread.replies}</span>
                      </div>
                    </div>
                    <span>{thread.date}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

       

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-1">
            <Button variant="default" size="sm" className="h-7 w-7 p-0">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              3
            </Button>
            <span className="mx-1">...</span>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              18
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2">
              Next
              <ChevronDown className="h-3 w-3 ml-1 rotate-270" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">Showing threads 1 to 10 of 178</div>
        </div>
      </Card>

       {/* Bottom Advertisements */}
       <div className="space-y-6 mt-6">
          {/* Bottom Advertisement 1 - 728x90 */}
          <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-center min-h-[90px] w-full max-w-[728px] mx-auto border-2 border-dashed border-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-bold text-muted-foreground">ADVERTISEMENT</p>
              <p className="text-sm text-muted-foreground">728 x 90</p>
            </div>
          </div>

          
        </div>
    </div>
  )
} 