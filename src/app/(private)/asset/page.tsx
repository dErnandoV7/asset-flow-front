"use client"

import { CircleDollarSign } from "lucide-react"
import { getAssetsAll } from "@/app/services/assetService"
import { useEffect, useState } from "react"
import { useAppContext } from "@/app/context/dataContext"
import { columns, Asset } from "./colunas"
import { DataTable } from "@/components/table"
import { getCriptWithValue } from "@/app/services/priceCriptoService"
import Alerts from "@/components/sweetAlerts/alerts"

export default function AssetsPage() {
    const { dispatch } = useAppContext()
    const [assets, setAssets] = useState<Asset[] | null>(null)

    const getAssets = async () => {

        dispatch({ type: "SET_LOADING_STATE_VALUE", payload: true })

        const { success, data, error } = await getAssetsAll()

        dispatch({ type: "SET_LOADING_STATE_VALUE", payload: false })

        if (!success) {
            Alerts.error({ title: "Erro", text: error })

            return
        }

        if (!data) return

        const assetIds = data.map((asset): string => {
            return asset.typeCanonicalName
        }).join(",")

        const { success: successCripto, data: dataCripto, error: errorCripto } = await getCriptWithValue(assetIds)

        if (!successCripto) Alerts.error({ title: "Erro", text: errorCripto })

        const criptosInArray = dataCripto ? Object.entries(dataCripto) : null

        const assets = data.map((asset): Asset => {
            const cripto: [string, { brl: number }] | undefined = criptosInArray?.find((cripto) => cripto[0] == asset.typeCanonicalName)

            const rendimento = cripto ? calcularRendimento(asset.purchasePrice, cripto[1].brl) : 0

            return {
                purchasePrice: Number(asset.purchasePrice.toFixed(2)).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                quantity: asset.quantity,
                type: asset.typeCanonicalName,
                walletName: asset.walletName,
                rendimento

            }
        })

        setAssets(assets)
    }

    const calcularRendimento = (valorCompra: number, valorAtualDeMercado: number) => (valorAtualDeMercado * 100 / valorCompra) - 100

    useEffect(() => {
        getAssets()
    }, [])

    return (
        <div className="w-full mt-14 md:mt-0 p-3">
            <div className="max-w-[1100px] m-auto lg:mt-20">
                <div className="border-b-2 border-secondary pb-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-3xl mb-2">
                            <CircleDollarSign size={24} />
                            <h2>Seus <strong className="text-primary">Ativos</strong></h2>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-[16px] max-w-[80%] mb-4">Visualização e gerenciamento de todas os seus <span className="font-bold">Ativos</span>.</p>

                </div>
                {assets && <DataTable columns={columns} data={assets} />}
            </div>
        </div>
    )
}

