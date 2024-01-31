import { useEffect } from "react"

function ClientDashboard() {
    useEffect(() => {
        document.title += " | Client Dashboard"
    }, [])
    return (
        <h2>Client Dashboard</h2>
    )
}

export default ClientDashboard