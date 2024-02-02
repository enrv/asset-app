import { useEffect } from "react"

function NotFound() {
    useEffect(() => {
        document.title += " | Page Not Found"
    }, [])

    return (
        <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Page not found</h2>
    )
}

export default NotFound