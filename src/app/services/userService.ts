import { apiBack } from "../../api/axios"
import { setCookie } from "../utils/cookiesUtil"
import { ApiResponse } from "../types/apiResponse"

export const login = async (email: string, password: string): Promise<ApiResponse<any>> => {
    try {
        const data = { email, password }
        const res = await apiBack.post("/login-user", data)

        const token = res.data.token
        setCookie("token", token, 7)

        return { success: true }

    } catch (error: any) {
        const message = error.response.data.message = "Erro ao realizar login"

        return { success: false, error: message }
    }
}

export const registerUser = async (email: string, password: string, name: string): Promise<ApiResponse<any>> => {
    try {
        const data = { email, password, name }
        const res = await apiBack.post("/create-user", data)

        return { success: true }

    } catch (error: any) {
        const message = error.response.data.message || "Erro ao registrar conta"

        return { success: false, error: message }
    }
}