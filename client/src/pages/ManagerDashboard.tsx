import { useEffect } from "react"

function ManagerDashboard() {
    useEffect(() => {
        document.title += " | Manager Dashboard"
    }, [])

    return (
        <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Manager Dashboard</h2>
    )
}

export default ManagerDashboard