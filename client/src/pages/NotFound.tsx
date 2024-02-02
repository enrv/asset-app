import { useEffect } from "react"
import { useLang } from "../hooks/useLang"

function NotFound() {
    const { getMessages } = useLang()

    useEffect(() => {
        document.title += " | " + getMessages().notFound.pageBrowserTitle
    }, [])

    return (
        <div>
            <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">{getMessages().notFound.pageBrowserTitle}</h2>
            <p>{getMessages().notFound.message}</p>
        </div>
    )
}

export default NotFound