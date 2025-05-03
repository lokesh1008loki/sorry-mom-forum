"use client"

import React from "react"
import TemplatePage from "../template-page"
import { generateMockThreads } from "@/lib/mock-data"

// Category data
const categoryData = {
  title: "Exclusive Content",
  description: "Premium exclusive content for members"
}

// Generate mock data
const threads = generateMockThreads()

// Breadcrumb data
const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Forums", href: "/forums" },
  { name: "Exclusive Content", href: "/forums/exclusive" }
]

export default function ExclusivePage() {
  return (
    <TemplatePage
      categoryData={categoryData}
      breadcrumbs={breadcrumbs}
      threads={threads}
    />
  )
} 