import React from "react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination"
import { cn } from "@/lib/utils"

interface PaginationProps {
    totalItems: number | undefined
    currentPage: number | undefined
    totalPages: number | undefined
    onPageCurrent: (pageCurrent: number) => void
}

const PaginationComponent = ({ onPageCurrent, currentPage, totalItems, totalPages }: PaginationProps) => {
    if (!totalItems || !currentPage || !totalPages) {
        return null
    }

    const isFirst = currentPage === 1
    const isLast = currentPage === totalPages
    const isPenultimate = currentPage === totalPages - 1
    const hasGapAfterCurrent = totalPages - currentPage > 1

    const handlePreviousButton = () => {
        if (isFirst) return
        onPageCurrent(currentPage - 1)
    }

    const handleNextButton = () => {
        if (isLast) return
        onPageCurrent(currentPage + 1)
    }

    const items: React.ReactNode[] = []

    const addPage = (page: number, active = false) => {
        items.push(
            <PaginationItem key={`page-${page}`}>
                <PaginationLink className={`${cn(active && "bg-muted")} cursor-pointer`} onClick={() => onPageCurrent(page)}>{page}</PaginationLink>
            </PaginationItem>
        )
    }

    const addEllipsis = (key: string) => {
        items.push(
            <PaginationItem key={`ellipsis-${key}`}>
                <PaginationEllipsis />
            </PaginationItem>
        )
    }

    addPage(1, isFirst)

    if (totalPages >= 3 && isFirst) {
        addPage(2)
    }

    if (isPenultimate) {
        addEllipsis("before-last")
    }

    if (!isFirst && !isLast) {
        addPage(currentPage, true)
    }

    if (hasGapAfterCurrent) {
        addEllipsis("after-current")
    }

    if (isLast) {
        addEllipsis("last")
    }

    if (totalPages > 1) {
        addPage(totalPages, isLast)
    }

    return (
        <Pagination className="mt-4 flex justify-end" >
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className="cursor-pointer" onClick={handlePreviousButton} />
                </PaginationItem>

                {items}

                <PaginationItem>
                    <PaginationNext className="cursor-pointer" onClick={handleNextButton} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationComponent