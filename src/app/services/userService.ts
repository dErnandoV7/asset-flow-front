import { apiBack } from "../../api/axios"
import { getTokenInCookie, setCookie } from "../utils/cookiesUtil"
import { ApiResponse } from "../types/apiResponse"
import { UserProfile } from "../types/userType"

interface UpdateUserProfilePayload {
    name?: string
    email?: string
    password?: string
}

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

const withAuthHeaders = () => {
    const token = getTokenInCookie()

    if (!token) {
        return { headers: {} }
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const getUserProfile = async (userId: number): Promise<ApiResponse<UserProfile>> => {
    try {
        const res = await apiBack.get(`/users/${userId}`, withAuthHeaders())
        const rawUser = res.data?.user ?? res.data

        const user: UserProfile = {
            id: rawUser?.id,
            name: rawUser?.name ?? "",
            email: rawUser?.email ?? "",
        }

        return { success: true, data: user }

    } catch (error: any) {
        const message = error.response?.data?.message || "Erro ao buscar perfil"
        return { success: false, error: message }
    }
}

export const updateUserProfile = async (userId: number, payload: UpdateUserProfilePayload): Promise<ApiResponse<UserProfile>> => {
    try {
        const res = await apiBack.put(`/update-user/${userId}`, payload, withAuthHeaders())
        const rawUser = res.data?.user ?? res.data

        const user: UserProfile = {
            id: rawUser?.id,
            name: rawUser?.name ?? payload.name ?? "",
            email: rawUser?.email ?? payload.email ?? "",
        }

        return { success: true, data: user }

    } catch (error: any) {
        const message = error.response?.data?.message || "Erro ao atualizar perfil"
        return { success: false, error: message }
    }
}

export const verifyUserPassword = async (userId: number, password: string): Promise<ApiResponse<any>> => {
    try {
        await apiBack.post(`/users/${userId}/compare-password`, { password }, withAuthHeaders())
        return { success: true }
    } catch (error: any) {
        const message = error.response?.data?.message || "Senha atual inválida"
        return { success: false, error: message }
    }
}