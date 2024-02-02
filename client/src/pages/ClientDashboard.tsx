import { useEffect } from "react"

function ClientDashboard() {
    useEffect(() => {
        document.title += " | Client Dashboard"
    }, [])
    return (
        <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Client Dashboard</h2>
    )
}

export default ClientDashboard