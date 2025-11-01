"use client"

import { Wallet } from "lucide-react"
import WalletCard from "@/components/walletCard"
import { getWalletAll } from "@/app/services/walletService"
import { useEffect, useState } from "react"
import CreateWalletModal from "@/components/modal/createWalletModal"
import { Wallet as WalletType } from "@/app/types/walletType"
import Alerts from "@/components/sweetAlerts/alerts"

export default function WalletPage() {
    const [wallets, setWallets] = useState<WalletType[] | null>(null)

    const getWallets = async () => {
        const res: any = await getWalletAll()

        if (res.error) {
            const message = res.dataError.response.data.message
            Alerts.error({ title: "Erro", text: message })

            return
        }

        const wallets: WalletType[] = res

        setWallets(wallets)
    }

    useEffect(() => {
        getWallets()
    }, [])

    return (
        <div className="w-full mt-14 md:mt-0 p-3">
            <div className="max-w-[1200px] m-auto lg:mt-20">
                <div className="border-b-2 border-secondary pb-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-3xl mb-2">
                            <Wallet size={24} />
                            <h2>Suas <strong className="text-primary">Carteiras</strong></h2>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-[16px] max-w-[80%] mb-4">Visualização e gerenciamento de todas as suas Carteiras.</p>
                    <CreateWalletModal createdNewWallet={() => getWallets()} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {wallets && wallets.map((wallet, idx) => {
                        return (
                            <WalletCard key={idx} countAssets={wallet.countAsset} createdAt={wallet.createdAt} name={wallet.name} type={wallet.typeMasq} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}