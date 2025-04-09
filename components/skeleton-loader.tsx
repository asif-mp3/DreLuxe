"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "default" | "card" | "list-item" | "text" | "circle" | "image"
  count?: number
}

export function Skeleton({ className, variant = "default", count = 1 }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className={cn("rounded-lg bg-muted animate-pulse", className)}>
            <div className="h-40 rounded-t-lg bg-muted-foreground/10"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-muted-foreground/10 rounded"></div>
              <div className="h-3 bg-muted-foreground/10 rounded"></div>
              <div className="h-3 w-5/6 bg-muted-foreground/10 rounded"></div>
              <div className="h-8 w-1/3 bg-muted-foreground/10 rounded-md mt-4"></div>
            </div>
          </div>
        )
      case "list-item":
        return (
          <div className={cn("flex items-center space-x-4 rounded-lg p-3 animate-pulse", className)}>
            <div className="h-12 w-12 rounded-md bg-muted-foreground/10"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 bg-muted-foreground/10 rounded"></div>
              <div className="h-3 w-1/2 bg-muted-foreground/10 rounded"></div>
            </div>
          </div>
        )
      case "text":
        return (
          <div className={cn("space-y-2 animate-pulse", className)}>
            <div className="h-4 bg-muted-foreground/10 rounded"></div>
            <div className="h-4 w-[90%] bg-muted-foreground/10 rounded"></div>
            <div className="h-4 w-[80%] bg-muted-foreground/10 rounded"></div>
          </div>
        )
      case "circle":
        return <div className={cn("rounded-full bg-muted-foreground/10 animate-pulse", className)}></div>
      case "image":
        return <div className={cn("rounded-md bg-muted-foreground/10 animate-pulse", className)}></div>
      default:
        return <div className={cn("h-4 w-full bg-muted-foreground/10 rounded animate-pulse", className)}></div>
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-2">
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}
