"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Mock announcement data
const announcements = [
  {
    id: 1,
    title: "Forum Maintenance Scheduled for Next Week",
    content: "We will be performing scheduled maintenance on our servers next week. The forum will be temporarily unavailable on Tuesday, 2:00 AM - 4:00 AM UTC.",
    author: {
      name: "Admin",
      role: "Administrator",
      avatar: "/admin-avatar.png"
    },
    date: "2 hours ago",
    likes: 45
  },
  {
    id: 2,
    title: "New Feature: Private Messaging System",
    content: "We're excited to announce the launch of our new private messaging system! You can now send direct messages to other members.",
    author: {
      name: "Moderator",
      role: "Moderator",
      avatar: "/mod-avatar.png"
    },
    date: "1 day ago",
    likes: 32
  },
  {
    id: 3,
    title: "Community Guidelines Update",
    content: "We've updated our community guidelines to better serve our growing community. Please take a moment to review the changes.",
    author: {
      name: "Admin",
      role: "Administrator",
      avatar: "/admin-avatar.png"
    },
    date: "3 days ago",
    likes: 28
  }
]

// Breadcrumb data
const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Forums", href: "/forums" },
  { name: "Announcements", href: "/forums/announcements" }
]

export default function AnnouncementsPage() {
  return (
    <div className="container py-6">
      {/* Breadcrumbs */}
      <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <Link href={crumb.href} className="hover:text-primary">
              {crumb.name}
            </Link>
            {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
          </React.Fragment>
        ))}
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Important news and updates from the admin team</p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="border-l-4 border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={announcement.author.avatar} alt={announcement.author.name} />
                  <AvatarFallback>{announcement.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{announcement.author.name}</p>
                  <p className="text-xs text-muted-foreground">{announcement.author.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{announcement.date}</p>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{announcement.content}</p>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{announcement.likes}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 