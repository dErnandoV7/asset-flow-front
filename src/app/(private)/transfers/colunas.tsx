"use client"

export type Transfer = {
    assetId: number,
    createdAt: string,
    date: string,
    id: number,
    price: number | string,
    quantity: number,
    type: "buy" | "sell" | "transfer",
    updatedAt: string,
    assetName: string,
    walletName: string
}

export type ColumnType = { accessorKey: string, header: string, show: boolean, jsx?: any }

export const ColumnsTransfers: ColumnType[] = [
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
        accessorKey: "assetName",
        header: "Ativo",
        show: true
    },
    {
        accessorKey: "quantity",
        header: "Quantidade",
        show: true
    },
    {
        accessorKey: "price",
        header: "Vlr méd. unit.",
        show: true
    },
    {
        accessorKey: "date",
        header: "Data",
        show: true,
    },
    // {
    //     accessorKey: "actions",
    //     header: "Ações",
    //     show: true
    // }
]