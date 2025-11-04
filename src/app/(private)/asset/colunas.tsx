"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Asset = {
    type: string,
    walletName: string,
    quantity: number,
    purchasePrice: string,
    rendimento: number
}

export const columns: ColumnDef<Asset>[] = [
    {
        accessorKey: "type",
        header: "Tipo",
    },
    {
        accessorKey: "walletName",
        header: "Carteira",
    },
    {
        accessorKey: "quantity",
        header: "Quantidade",
    },
    {
        accessorKey: "purchasePrice",
        header: "Vlr méd. unit.",
    },
    {
        accessorKey: "rendimento",
        header: "Rendimento",
        cell: ({ row }) => {
            const rendimento = parseFloat(row.getValue("rendimento"))

            return <p className={`text-gray-400 font-bold ${rendimento > 0 ? "text-green-500" : "text-red-500"}`}>
                {rendimento.toLocaleString("pt-BR", {
                    style: "percent",
                })}
            </p>
        }
    }
]