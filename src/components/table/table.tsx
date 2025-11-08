"use client"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ColumnType } from "@/app/(private)/asset/colunas"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Waypoints, DollarSign, Wallet, ArrowRightLeft, LineChart, BarChart, LucideDollarSign, Settings2 } from "lucide-react"


interface DataTable {
  data: any[],
  columns: ColumnType[],
  onTransfer?: (d: any) => void,
  onBuy?: (d: any) => void,
  onSell?: (d: any) => void,
}

export function DataTable({ columns, data, onBuy, onSell, onTransfer }: DataTable) {

  return (
    <div className="overflow-hidden rounded-xl border mt-2">
      <Table>
        <TableHeader className="bg-card">
          <TableRow>
            {columns && columns.map((column, idx) => {
              if (!column.show) return
              return (
                <TableCell key={idx}>
                  {column.header}
                </TableCell>
              )
            }
            )}
          </TableRow>

        </TableHeader>
        <TableBody>
          {data && data.map((content, idx) => {
            return (
              <TableRow key={idx}>
                {columns && columns.map((column, idx_) => {
                  if (!column.show) return

                  if (column.accessorKey === "actions") {
                    return (
                      <TableCell key={`${column.accessorKey}-${idx_}`}>
                        <DropdownMenu dir="rtl">
                          <DropdownMenuTrigger asChild>
                            <Button  className="cursor-pointer bg-card/40 hover:bg-secondary" type="button">
                              <Settings2 className="h-5! w-5!" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onBuy && (
                              <DropdownMenuItem className="text-xs cursor-pointer flex justify-between items-center" onClick={() => onBuy(content)}>
                                <Wallet />
                                Comprar ativo
                              </DropdownMenuItem>
                            )}
                            {onSell && (
                              <DropdownMenuItem className="text-xs cursor-pointer flex justify-between items-center" onClick={() => onSell(content)}>
                                <DollarSign />
                                Vender ativo
                              </DropdownMenuItem>
                            )}
                            {onTransfer && (
                              <DropdownMenuItem className="text-xs cursor-pointer flex justify-between items-center" onClick={() => onTransfer(content)}>
                                <ArrowRightLeft />
                                Transferir ativo
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )
                  }

                  const selected = Object.entries(content).find((a) => a[0] == column.accessorKey)
                  if (!selected) return

                  const isJsxElement = column.jsx

                  return (
                    <TableCell className="capitalize" key={`${column.accessorKey}-${idx_}`}>
                      {isJsxElement ? column.jsx(selected[1]) : selected[1]}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}