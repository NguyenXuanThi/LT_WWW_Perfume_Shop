import { useCallback } from "react"
import { useAxios } from "./http"
import type { ApiResponse } from "@/interface/Response"
import type { UserError, UpdateUser } from "@/interface/User"
// import { useStore } from "@/store"

export default function useUserService() {
    const { axiosPrivate } = useAxios()

    const update = useCallback(async (updateUser: UpdateUser) => {
        let success = false
        let message = ""
        let errors = undefined as undefined | UserError

        try {
            const res = await axiosPrivate.post<ApiResponse<boolean>>("/users/update", updateUser)
            const data = res.data
            success = data.body as boolean
        } catch (error) {
            const data = error as ApiResponse<boolean>
            message = data.message ?? "Lỗi không xác định từ Server."
            errors = data.errors
        }

        return { success, message, errors }
    }, [])

    return { update }
}