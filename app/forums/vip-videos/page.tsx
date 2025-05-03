"use client"

import React from "react"
import TemplatePage from "../template-page"

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

const categoryData: CategoryInfo = {
  title: "VIP Videos",
  description: "Premium content for VIP members",
  parent: "vip"
}

// Generate mock data outside the component
const generateMockThreads = (): Thread[] => {
  const threads: Thread[] = []
  
  for (let i = 1; i <= 10; i++) {
    const month = i % 2 === 0 ? "Apr" : "May"
    const day = (i * 3) % 28 + 1
    const replies = (i * 15) % 100 + 15
    const views = (i * 500) % 5000 + 1500
    const likes = (i * 100) % 1000 + 100
    const isPinned = i === 3
    const isLocked = i === 4
    const isHot = i % 2 === 0
    const isNew = i % 3 === 0

    threads.push({
      id: i,
      title: `${i % 2 === 0 ? "📱" : "🔥"} VIP Premium Content #${i} - ${
        i % 3 === 0 ? "MEGA Collection" : "Latest Release"
      } ${i % 4 === 0 ? "🔥🔥" : ""}`,
      author: {
        name: `VIPUser${i}`,
        avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=vipAvatar${i}`,
      },
      date: `${month} ${day}, 2023`,
      replies,
      views,
      likes,
      lastReply: {
        author: `VIP${i * 10}`,
        avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=vipReply${i}`,
        date: `${i % 24} ${i % 3 === 0 ? "minutes" : i % 2 === 0 ? "hours" : "days"} ago`,
      },
      isPinned,
      isLocked,
      isHot,
      isNew,
      thumbnail: `/abstract-geometric-shapes.png?height=80&width=80&query=vip${i}`,
    })
  }
  
  return threads
}

// Generate mock data once
const threads = generateMockThreads()

  // Breadcrumb data
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Forums", href: "/forums" },
  { name: "VIP", href: "/forums/vip" },
  { name: "VIP Videos", href: "/forums/vip-videos" }
  ]

export default function VIPVideosPage() {
  return (
    <TemplatePage
      categoryData={categoryData}
      breadcrumbs={breadcrumbs}
      threads={threads}
    />
  )
}
