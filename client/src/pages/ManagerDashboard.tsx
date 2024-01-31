import { useEffect } from "react"

function ManagerDashboard() {
    useEffect(() => {
        document.title += " | Manager Dashboard"
    }, [])

    return (
        <h2>Manager Dashboard</h2>
    )
}

export default ManagerDashboard