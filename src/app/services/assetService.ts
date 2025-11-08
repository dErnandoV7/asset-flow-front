import { apiBack } from "../../api/axios"
import { getTokenInCookie } from "../utils/cookiesUtil"
import { createAssetType } from "../schemas/assetSchema"
import { ApiResponse } from "../types/apiResponse"
import { Asset } from "../types/assetType"

export type AssetOrderByType = "quantity" | "purchasePrice"
export type AssetFilterType = "investment" | "savings" | "checking"

interface getAssetsAllProps {
    search?: string,
    orderBy?: AssetOrderByType,
    direction?: "asc" | "desc",
    filter?: AssetFilterType,
    walletId?: string
}

export const getAssetsAll = async ({ orderBy, search, direction, filter, walletId }: getAssetsAllProps): Promise<ApiResponse<Asset>> => {
    const token = getTokenInCookie()

    try {
        
        const res = await apiBack.get(`assets`, {
            params: {
                search,
                orderBy,
                direction: direction || "desc",
                walletType: filter,
                walletId
            },
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