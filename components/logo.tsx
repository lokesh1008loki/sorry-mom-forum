'use client'

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="font-bold text-xl">SorryMom</span>
      <span className="ml-1 text-primary text-xl">Forum</span>
    </div>
  )
}
