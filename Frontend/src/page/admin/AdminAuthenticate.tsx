import { useStore } from "@/store"
import { Navigate, Outlet } from "react-router-dom"

const AdminAuthenticate = () => {
    const { user } = useStore()

    if (!user || user.vaiTro !== "Admin")
        return <Navigate to="/" replace />

    return <Outlet />
}

export default AdminAuthenticate
