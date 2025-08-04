import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/userStore"

const ProtectedRoute = () => {
    const { user, isLoading } = useUserStore();

    if (isLoading) return <div>Loading...</div>

    if (!user) return <Navigate to="/" replace />

    return <Outlet />


}

export default ProtectedRoute