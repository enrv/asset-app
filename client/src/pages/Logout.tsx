import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function Logout() {
    useEffect(() => {
        document.title += " | Logout"
    }, [])

    const { logout } = useAuth()
    logout()

    return <Navigate to="/" />
}

export default Logout