import { apiBack } from "@/api/axios";
import { getTokenInCookie } from "../utils/cookiesUtil";
import { ApiResponsePagination } from "../types/apiResponse";
import { Transfer } from "../(private)/transfers/colunas";
import { TypeWallet } from "../types/walletType";
import { typeTransferType } from "../types/transferType";

export const getTranfersAll = async (
    walletId?: string,
    typeTransfer?: typeTransferType,
    walletType?: TypeWallet,
    page?: number
): Promise<ApiResponsePagination<any>> => {
    const token = getTokenInCookie()

    try {

        const res = await apiBack.get("/transfers",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    walletId, typeTransfer, walletType, page
                }
            })

        const data = res.data?.transfers.map((transfer: any): Transfer => {
            return {
                assetId: transfer.assetId,
                assetName: transfer.asset.identify.canonicalName,
                createdAt: transfer.createdAt,
                date: transfer.date,
                id: transfer.id,
                price: transfer.price,
                quantity: transfer.quantity,
                type: transfer.type,
                updatedAt: transfer.updatedAt,
                walletName: transfer.asset.wallet.name
            }
        })

        const total = res.data.total

        return {
            success: true,
            data,
            total
        }
    } catch (error: any) {
        const message = error.response.data.message || "Erro ao buscar ativos"

        return { success: false, error: message }
    }
}