"use client"

import { Wallet } from "lucide-react"
import WalletCard from "@/components/walletCard"
import { getWalletAll } from "@/app/services/walletService"
import { getIdentitysAll } from "@/app/services/identityTypeService"
import { useEffect, useState } from "react"
import CreateWalletModal from "@/components/modal/createWalletModal"
import { Wallet as WalletType } from "@/app/types/walletType"
import { AssetIdentity } from "@/app/types/assetType"
import Alerts from "@/components/sweetAlerts/alerts"
import { useAppContext } from "@/app/context/dataContext"
import LoadingWallet from "@/components/loadingWallet"

export default function WalletPage() {
    const { dispatch } = useAppContext()

    const [wallets, setWallets] = useState<WalletType[] | null>(null)
    const [identitys, setIdentitys] = useState<AssetIdentity[] | null>(null)
    const [loading, setElement] = useState<boolean>(false)

    const getWallets = async () => {
        setElement(true)

        const { success, data, error } = await getWalletAll()

        setElement(false)

        if (!success) {
            Alerts.error({ title: "Erro", text: error })

            return
        }

        if (Array.isArray(data)) setWallets(data)
    }

    const getIdentitys = async () => {
        const { success, data, error } = await getIdentitysAll()

        if (!success) {
            Alerts.error({ title: "Erro", text: error })

            return
        }

        if (!data) return
        console.log(data)
        dispatch({ type: "SET_ASSETS_IDENTITY", payload: data })

        setIdentitys(data)
    }

    useEffect(() => {
        getWallets()
        getIdentitys()
    }, [])

    return (
        <div className="w-full mt-14 md:mt-0 p-3 ">
            <div className="max-w-[1100px] m-auto lg:mt-20">
                <div className="border-b-2 border-secondary pb-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-3xl mb-2">
                            <Wallet size={24} />
                            <h2>Suas <strong className="text-primary">Carteiras</strong></h2>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-[16px] max-w-[80%] mb-4">Visualização e gerenciamento de todas as suas <span className="font-bold">Carteiras</span>.</p>
                    <CreateWalletModal createdNewWallet={() => getWallets()} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {wallets && wallets.map((wallet, idx) => {
                        return (
                            <WalletCard key={idx} countAssets={wallet.countAsset} createdAt={wallet.createdAt} name={wallet.name} type={wallet.typeMasq} walletId={wallet.id} />
                        )
                    })}
                    {loading && <LoadingWallet />}
                </div>
            </div>
        </div>
    )
}