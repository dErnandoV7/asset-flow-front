"use client"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface RouteLoadingProps {
    message?: string
    className?: string
    fullscreen?: boolean
}

export function RouteLoading({ message = "Carregando conteúdo", className, fullscreen = true }: RouteLoadingProps) {
    const containerStyles = fullscreen
        ? "fixed inset-0 z-50 flex w-full items-center justify-center bg-background/80 backdrop-blur-sm"
        : "flex min-h-[200px] items-center justify-center"

    return (
        <div className={cn(containerStyles, "p-6", className)} role="status" aria-live="polite">
            <div className="flex flex-col items-center gap-3 text-center">
                <Spinner size="md" />
                <p className="text-sm font-medium text-muted-foreground">
                    {message}
                </p>
            </div>
        </div>
    )
}
