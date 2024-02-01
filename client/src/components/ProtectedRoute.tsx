import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const enum ProtectionType {
    ClientOnly,
    ManagerOnly,
    ClientOrManager,
    NotLoggedIn,
}

const ProtectedRoute = ({ children, type }) => {
    const { user } = useAuth()

    if (!authorize(user, type)) {
        const page = (type === ProtectionType.NotLoggedIn) ? "/" : "/login"
        return <Navigate to={page} />
    }

    return children
}

function authorize(user, type: ProtectionType) {
    switch (type) {
        case ProtectionType.NotLoggedIn:
            return !user
        case ProtectionType.ClientOrManager:
            return user
        case ProtectionType.ClientOnly:
            return user && user.kindofuser === "client"
        case ProtectionType.ManagerOnly:
            return user && user.kindofuser === "manager"
        default:
            return false
    }
}

export { ProtectedRoute, ProtectionType }