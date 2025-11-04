import { apiBack } from "../../api/axios"
import { getTokenInCookie } from "../utils/cookiesUtil"
import { createAssetType } from "../schemas/assetSchema"
import { ApiResponse } from "../types/apiResponse"
import { Asset } from "../types/assetType"

export const getAssetsAll = async (): Promise<ApiResponse<Asset>> => {
    const token = getTokenInCookie()

    try {
        const res = await apiBack.get("assets", {
            params: {},
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const assetsMap = res.data.assets.map((asset: any): Asset => {
            return {
                purchasePrice: asset.purchasePrice,
                quantity: asset.quantity,
                type: asset.identify.symbol,
                walletName: asset.wallet.name,
                typeCanonicalName: asset.identify.canonicalName
            }
        })

        return { success: true, data: assetsMap }

    } catch (error: any) {
        const message = error.response.data.message || "Erro ao buscar ativos"

        return { success: false, error: message }
    }
}

export const createAsset = async (data: createAssetType): Promise<ApiResponse<any>> => {
    const token = getTokenInCookie()

    try {
        const res = await apiBack.put("/buy-asset", data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

        return { success: true }

    } catch (error: any) {
        const message = error.response.data.message || "Erro ao criar Ativo"

        return { success: false, error: message }
    }

}