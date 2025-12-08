import { useStore } from "@/store"
import { Navigate, Outlet } from "react-router-dom"

const AccountAuthenticate = () => {
    const { user } = useStore()

    if (!user)
        return <Navigate to="/" replace />

    return <Outlet />
}

export default AccountAuthenticate
