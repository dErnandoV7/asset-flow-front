"use client"

import { cn } from "@/lib/utils"

interface SpinnerProps {
    size?: "sm" | "md" | "lg"
    className?: string
}

const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-16 w-16 border-4",
}

export function Spinner({ size = "md", className }: SpinnerProps) {
    return (
        <span
            className={cn(
                "inline-block rounded-full border-primary/80 border-r-transparent border-t-primary/80 border-b-primary/50 border-l-primary/50 animate-spin",
                sizeMap[size],
                className
            )}
            aria-hidden="true"
        />
    )
}
