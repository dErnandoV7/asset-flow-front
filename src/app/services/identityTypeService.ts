import { apiBack } from "../../api/axios"
import { getTokenInCookie } from "../utils/cookiesUtil"
import { ApiResponse } from "../types/apiResponse"
import { AssetIdentity } from "../types/assetType"

export const getIdentitysAll = async (): Promise<ApiResponse<AssetIdentity>> => {
    const token = getTokenInCookie()

    try {
        const res = await apiBack.get("/assets-identitys", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const assetsIdentityMap = res.data.assetsIdentity.map((identity: any): AssetIdentity => {
            return {
                id: identity.id,
                canonicalName: identity.canonicalName,
                symbol: identity.symbol
            }
        })

        return { success: true, data: assetsIdentityMap }

    } catch (error: any) {
        const message = error.response.data.message || "Erro ao buscar identificadores de ativos"

        return { success: false, error: message }
    }
}