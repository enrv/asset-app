import { useEffect } from "react"
import { Navigate } from "react-router-dom"

function Logout() {
    useEffect(() => {
        document.title += " | Logout"
    }, [])

    localStorage.removeItem("access_token")
    localStorage.removeItem("user_info")

    return <Navigate to="/" />
}

export default Logout