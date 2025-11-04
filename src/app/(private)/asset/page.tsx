"use client"

import { CircleDollarSign } from "lucide-react"
import { getAssetsAll } from "@/app/services/assetService"
import { useEffect } from "react"
import { useAppContext } from "@/app/context/dataContext"

export default function AssetsPage() {
    const { dispatch } = useAppContext()

    const getAssets = async () => {

        dispatch({ type: "SET_LOADING_STATE_VALUE", payload: true })
        
        const { success, data, error } = await getAssetsAll()

        dispatch({ type: "SET_LOADING_STATE_VALUE", payload: false })
    }

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
            </div>
        </div>
    )
}

