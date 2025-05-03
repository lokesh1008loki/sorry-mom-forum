"use client"

import React from "react"
import TemplatePage from "../template-page"
import { forumCategories } from "../categories"

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

interface PageProps {
  params: Promise<{
    category: string
  }>
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
      title: `${i % 2 === 0 ? "📱" : "🔥"} Premium Content #${i} - ${
        i % 3 === 0 ? "MEGA Collection" : "Latest Release"
      } ${i % 4 === 0 ? "🔥🔥" : ""}`,
      author: {
        name: `User${i}`,
        avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=avatar${i}`,
      },
      date: `${month} ${day}, 2023`,
      replies,
      views,
      likes,
      lastReply: {
        author: `User${i * 10}`,
        avatar: `/abstract-geometric-shapes.png?height=40&width=40&query=reply${i}`,
        date: `${i % 24} ${i % 3 === 0 ? "minutes" : i % 2 === 0 ? "hours" : "days"} ago`,
      },
      isPinned,
      isLocked,
      isHot,
      isNew,
      thumbnail: `/abstract-geometric-shapes.png?height=80&width=80&query=thumb${i}`,
    })
  }
  
  return threads
}

// Generate mock data once
const threads = generateMockThreads()

// Base breadcrumb data
const baseBreadcrumbs = [
    { name: "Home", href: "/" },
  { name: "Forums", href: "/forums" }
]

export default function CategoryPage({ params }: PageProps) {
  // Use React.use() to unwrap the params promise
  const unwrappedParams = React.use(params)
  const categorySlug = unwrappedParams.category

  // Find the category and its sub-category
  let categoryData = null
  let subCategoryData = null
  let breadcrumbs = [...baseBreadcrumbs]

  // First check if it's a sub-category
  for (const category of forumCategories) {
    const subCategory = category.subCategories?.find(
      sub => sub.slug === categorySlug
    )
    if (subCategory) {
      categoryData = category
      subCategoryData = subCategory
      breadcrumbs.push(
        {
          name: category.title,
          href: `/forums/${category.slug}`
        },
        {
          name: subCategory.title,
          href: `/forums/${subCategory.slug}`
        }
      )
      break
    }
  }

  // If not a sub-category, check if it's a main category
  if (!categoryData) {
    categoryData = forumCategories.find(cat => cat.slug === categorySlug)
    if (categoryData) {
      breadcrumbs.push({
        name: categoryData.title,
        href: `/forums/${categoryData.slug}`
      })
    }
  }

  // If no category found, use default
  if (!categoryData) {
    categoryData = {
      title: "Category",
      description: "Category description",
      slug: categorySlug
    }
    breadcrumbs.push({
      name: categoryData.title,
      href: `/forums/${categorySlug}`
    })
  }

  return (
    <TemplatePage
      categoryData={{
        title: subCategoryData?.title || categoryData.title,
        description: subCategoryData?.description || categoryData.description
      }}
      breadcrumbs={breadcrumbs}
      threads={threads}
    />
  )
}
