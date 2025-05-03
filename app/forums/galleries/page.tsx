"use client"

import React from "react"
import TemplatePage from "../template-page"
import { generateMockThreads } from "@/lib/mock-data"

// Category data
const categoryData = {
  title: "Galleries & Videos",
  description: "Premium video and picture galleries"
}

// Generate mock data
const threads = generateMockThreads()

// Breadcrumb data
const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Forums", href: "/forums" },
  { name: "Galleries & Videos", href: "/forums/galleries" }
]


export default function GalleriesPage() {
  return (
    <TemplatePage
      categoryData={categoryData}
      breadcrumbs={breadcrumbs}
      threads={threads}
    />
  )
} 