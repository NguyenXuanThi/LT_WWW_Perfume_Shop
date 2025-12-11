import { useCallback } from "react"
import { useAxios } from "./http"
import type { ApiResponse, PageUser } from "@/interface/Response"
import type { UserError, UpdateUser, User, TenVaiTro, ChangeVaiTro } from "@/interface/User"
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

    const getTaiKhoanPage = useCallback(async (page: number, search: string | undefined, role: string | undefined, status: boolean | undefined) => {
        let content = [] as User[]
        let totalPages = 0
        let message = ""
        let errors = undefined as undefined | UserError

        try {
            const searchParam = search ? `&search=${search}` : ""
            const roleParam = role ? `&role=${role}` : ""
            const statusParam = status !== undefined ? `&status=${status}` : ""
            const res = await axiosPrivate.get<ApiResponse<PageUser>>(`/users/manage?page=${page}${searchParam}${roleParam}${statusParam}`)
            const data = res.data
            content = data.body?.content as User[]
            totalPages = data.body?.totalPages as number
        } catch (error) {
            const data = error as ApiResponse<boolean>
            message = data.message ?? "Lỗi không xác định từ Server."
            errors = data.errors
        }

        return { content, totalPages, message, errors }
    }, [])

    const changeActive = useCallback(async (email: string, active: boolean, vaiTro: TenVaiTro) => {
        let success = false
        let message = ""
        let errors = undefined as undefined | UserError

        if (vaiTro === "Admin") {
            return { success: false, message: "Không thể thay đổi trạng thái của tài khoản Admin.", errors: undefined }
        }

        try {
            const res = await axiosPrivate.get<ApiResponse<boolean>>(`/users/manage/change_active/${email}?active=${active}`)
            const data = res.data
            success = data.body as boolean
        } catch (error) {
            const data = error as ApiResponse<boolean>
            message = data.message ?? "Lỗi không xác định từ Server."
            errors = data.errors
        }

        return { success, message, errors }
    }, [])

    const changeVaiTro = useCallback(async (request: ChangeVaiTro) => {
        let success = false
        let message = ""
        let errors = undefined as undefined | UserError

        if (request.emailNeedChange === "admin@shop.com") {
            return { success: false, message: "Không thể thay đổi trạng thái của tài khoản này.", errors: undefined }
        }
        if (request.emailExecute !== "admin@shop.com") {
            return { success: false, message: "Không có quyền để thay đổi vai trò.", errors: undefined }
        }

        try {
            const res = await axiosPrivate.post<ApiResponse<boolean>>(`/users/manage/change_vaitro`, request)
            const data = res.data
            success = data.body as boolean
        } catch (error) {
            const data = error as ApiResponse<boolean>
            message = data.message ?? "Lỗi không xác định từ Server."
            errors = data.errors
        }

        return { success, message, errors }
    }, [])

    return { update, getTaiKhoanPage, changeActive, changeVaiTro }
}