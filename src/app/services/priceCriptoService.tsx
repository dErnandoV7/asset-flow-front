import { apiCript } from "../../api/axios"
import { ApiResponse } from "../types/apiResponse"

export const getCriptWithValue = async (ids: string): Promise<ApiResponse<any>> => {
    try {

        const res = await apiCript.get("/price", {
            params: {
                vs_currencies: "brl",
                ids
            }
        })

        const ObjToArrayData = Object.entries(res.data)

        return { success: true, data: ObjToArrayData }

    } catch (error) {
        return { success: false, error: "Erro ao buscar valores de CRIPTOS" }
    }

} 