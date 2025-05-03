'use client'

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface AdSpaceProps {
  className?: string
  layout?: "horizontal" | "vertical" | "grid"
  size?: "default" | "large"
}

export function AdSpace({ className, layout = "horizontal", size = "default" }: AdSpaceProps) {
  const advertisementText = useTranslation("advertisement")

  return (
    <Card className={cn(className)}>
      <CardContent className={cn("p-4", size === "large" && "p-6")}>
        <div
          className={cn(
            "grid gap-4",
            layout === "horizontal" && "grid-cols-1 md:grid-cols-3",
            layout === "vertical" && "grid-cols-1",
            layout === "grid" && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {/* Ad Slot 1 */}
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-6 text-center",
              size === "large" && "h-[150px]",
              size === "default" && "h-[100px]",
            )}
          >
            <p className="text-xs text-muted-foreground">{advertisementText}</p>
          </div>

          {/* Ad Slot 2 */}
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-6 text-center",
              size === "large" && "h-[150px]",
              size === "default" && "h-[100px]",
            )}
          >
            <p className="text-xs text-muted-foreground">{advertisementText}</p>
          </div>

          {/* Ad Slot 3 */}
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-6 text-center",
              size === "large" && "h-[150px]",
              size === "default" && "h-[100px]",
            )}
          >
            <p className="text-xs text-muted-foreground">{advertisementText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
