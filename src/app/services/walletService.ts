import axios from "../../api/axios"
import { getTokenInCookie } from "../utils/cookiesUtil"
import { CreateWallet, Wallet, WalletType } from "../types/walletType"
import { setTypeMasc, getOnlyDate } from "../utils/walletUtils"

export const getWalletAll = async () => {
    const token = getTokenInCookie()

    try {
        const res = await axios.get("/wallets", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        const wallets = res.data.wallets

        const walletsMap = wallets.map((wallet: any) => {
            return {
                name: wallet.name,
                type: wallet.type,
                typeMasq: setTypeMasc(wallet.type),
                countAsset: wallet._count.assets,
                createdAt: getOnlyDate(wallet.createdAt)
            }
        })

        return walletsMap

    } catch (error) {
        console.log(error)
        return { error: true, errorData: error }
    }
}

export const createWallet = async (data: CreateWallet) => {
    const token = getTokenInCookie()

    try {
        const res = await axios.post("/create-wallet", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res

    } catch (error) {
        return { error: true, errorData: error }
    }
}