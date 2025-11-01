import axios from "../../api/axios"
import { setCookie } from "../utils/cookiesUtil"

export const login = async (email: string, password: string) => {
    try {
        const data = { email, password }
        const res = await axios.post("/login-user", data)

        const token = res.data.token
        setCookie("token", token, 7)

        return res

    } catch (error) {
        return { error: true, dataError: error }
    }
}

export const registerUser = async (email: string, password: string, name: string) => {
    try {
        const data = { email, password, name }
        const res = await axios.post("/create-user", data)

        return res

    } catch (error) {
        return { error: true, dataError: error }
    }
}