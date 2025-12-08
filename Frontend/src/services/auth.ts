import { useCallback } from "react"
import { useAxios } from "./http"
import type { ApiResponse, LoginRespone } from "@/interface/Response"
import type { UserError, NewUser, User } from "@/interface/User"
import { useStore } from "@/store"

export default function useAuthService() {
    const { axiosPublic } = useAxios()
    const { setToken, setUser } = useStore()

    const login = useCallback(async (email: string, password: string) => {
        let token = ""
        let message = ""
        let user = undefined as undefined | User

        try {
            const res = await axiosPublic.post<ApiResponse<LoginRespone>>("/auth/login", { email, password })
            const data = res.data
            token = data.body?.token as string
            setToken(token)
            user = data.body?.user as User
            setUser(user)
        } catch (error) {
            const data = error as ApiResponse<boolean>
            message = data.message ?? "Lỗi không xác định từ Server."
        }

        return { token, message, user }
    }, [])

    const register = useCallback(async (newUser: NewUser) => {
        let success = false
        let message = ""
        let errors = undefined as undefined | UserError

        try {
            const res = await axiosPublic.post<ApiResponse<boolean>>("/auth/register", newUser)
            const data = res.data
            success = data.body as boolean
        } catch (error) {
            const data = error as ApiResponse<boolean>
            message = data.message ?? "Lỗi không xác định từ Server."
            errors = data.errors
        }

        return { success, message, errors }
    }, [])

    return { login, register }
}