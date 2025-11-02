import axios from "../../api/axios"
import { getTokenInCookie } from "../utils/cookiesUtil"
import { CreateWallet, Wallet } from "../types/walletType"
import { setTypeMasc, getOnlyDate } from "../utils/walletUtils"
import { ApiResponse } from "../types/apiResponse"

export const getWalletAll = async (): Promise<ApiResponse<Wallet>> => {
    const token = getTokenInCookie()

    try {
        const res = await axios.get("/wallets", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const walletsMap = res.data.wallets.map((wallet: any): Wallet => {
            return {
                id: wallet.id,
                name: wallet.name,
                type: wallet.type,
                typeMasq: setTypeMasc(wallet.type),
                countAsset: wallet._count.assets,
                createdAt: getOnlyDate(wallet.createdAt)
            }
        })

        return { success: true, data: walletsMap }

    } catch (error: any) {
        const message = error.response.data.message || "Erro ao buscar carteiras"

        return { success: false, error: message }
    }
}

export const createWallet = async (data: CreateWallet): Promise<ApiResponse<any>> => {
    const token = getTokenInCookie()

    try {
        const res = await axios.post("/create-wallet", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return { success: true }

    } catch (error: any) {
        const message = error.response.data.message || "Erro ao criar carteira"
        return { success: false, error: message }
    }
}