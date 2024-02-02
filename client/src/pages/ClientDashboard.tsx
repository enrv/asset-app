import { useEffect } from "react"
import { useLang } from "../hooks/useLang"

function ClientDashboard() {
    const { getMessages } = useLang()

    useEffect(() => {
        document.title += " | " + getMessages().clientDashboard.pageBrowserTitle
    }, [])
    return (
        <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">{getMessages().clientDashboard.pageTitle}</h2>
    )
}

export default ClientDashboard