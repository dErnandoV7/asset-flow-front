"use client"

import { ColumnsAssets } from "@/app/(private)/asset/colunas"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"

const visibleColumns = ColumnsAssets.filter((column) => column.show)

const getSkeletonWidth = (accessorKey: string) => {
    switch (accessorKey) {
        case "type":
            return "w-32"
        case "walletName":
            return "w-40"
        case "quantity":
            return "w-16"
        case "purchasePrice":
            return "w-28"
        case "rendimento":
            return "w-24"
        default:
            return "w-16"
    }
}

const LoadingAsset = () => {
    return (
        <div className="overflow-hidden rounded-xl border mt-2">
            <Table>
                <TableHeader className="bg-card">
                    <TableRow>
                        {visibleColumns.map((column) => (
                            <TableCell key={column.accessorKey} className="font-semibold text-muted-foreground">
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {visibleColumns.map((column) => (
                                <TableCell key={`${column.accessorKey}-${rowIndex}`}>
                                    {column.accessorKey === "actions" ? (
                                        <Skeleton className="h-8 w-16 rounded-md" />
                                    ) : (
                                        <Skeleton className={`h-5 ${getSkeletonWidth(column.accessorKey)} rounded-md`} />
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default LoadingAsset