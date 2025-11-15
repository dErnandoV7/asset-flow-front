"use client"

import { JSX } from "react"

export type Asset = {
    id: number,
    type: string,
    walletName: string,
    quantity: number,
    purchasePrice: string,
    rendimento: number,
    walletId: number,
    identifyId: number,
}

export type ColumnType = { accessorKey: string, header: string, show: boolean, jsx?: any }

export const ColumnsAssets: ColumnType[] = [
    {
        accessorKey: "type",
        header: "Tipo",
        show: true
    },
    {
        accessorKey: "walletName",
        header: "Carteira",
        show: true
    },
    {
        accessorKey: "quantity",
        header: "Quantidade",
        show: true
    },
    {
        accessorKey: "purchasePrice",
        header: "Vlr méd. unit.",
        show: true
    },
    {
        accessorKey: "rendimento",
        header: "Rendimento",
        show: true,
        jsx: (cell: string): JSX.Element => {
            const rendimento = parseFloat(cell)
            const rendimentoFormatado = Number(rendimento.toFixed(2))

            return <p className={`text-gray-400 font-bold ${rendimento > 0 ? "text-green-500" : "text-red-500"}`}>
                {rendimentoFormatado}%
            </p>
        }
    },
    {
        accessorKey: "actions",
        header: "Ações",
        show: true
    }
]