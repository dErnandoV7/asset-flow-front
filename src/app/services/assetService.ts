import { apiBack } from "../../api/axios"
import { getTokenInCookie } from "../utils/cookiesUtil"
import { createAssetType } from "../schemas/assetSchema"
import { ApiResponse, ApiResponsePagination } from "../types/apiResponse"
import { Asset, AssetFilterType, AssetOrderByType } from "../types/assetType"

interface getAssetsAllProps {
    search?: string,
    orderBy?: AssetOrderByType,
    direction?: "asc" | "desc",
    filter?: AssetFilterType,
    walletId?: string,
    cursorId?: number
}

interface SellAssetPayload {
    assetId: number
    price: number
    quantity: number
}

interface TransferAssetPayload {
    identifyId: number
    quantity: number
    sourceAssetId: number
    sourceWalletId: number
    targetWalletId: number
}

export const getAssetsAll = async ({ orderBy, search, direction, filter, walletId, cursorId }: getAssetsAllProps): Promise<ApiResponsePagination<Asset>> => {
    const token = getTokenInCookie()

    try {

        const res = await apiBack.get(`assets`, {
            params: {
                search,
                orderBy,
                direction: direction || "desc",
                walletType: filter,
                walletId,
                ...(cursorId ? { cursorId } : {})
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
                typeCanonicalName: asset.identify.canonicalName,
                walletId: asset.walletId,
                identifyId: asset.identifyId,
                id: asset.id
            }
        })

        return { success: true, data: assetsMap, total: res.data.total }

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

export const sellAsset = async (data: SellAssetPayload): Promise<ApiResponse<any>> => {
    const token = getTokenInCookie()

    try {
        await apiBack.put("/sell-asset", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return { success: true }

    } catch (error: any) {
        const message = error.response?.data?.message || "Erro ao vender ativo"
        return { success: false, error: message }
    }
}

export const transferAsset = async (data: TransferAssetPayload): Promise<ApiResponse<any>> => {
    const token = getTokenInCookie()

    try {
        await apiBack.put("/transfer-asset", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return { success: true }

    } catch (error: any) {
        const message = error.response?.data?.message || "Erro ao transferir ativo"
        return { success: false, error: message }
    }
}