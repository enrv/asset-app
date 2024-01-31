import { useEffect } from "react"

function NotFound() {
    useEffect(() => {
        document.title += " | Page Not Found"
    }, [])

    return (
        <h2>Page not found</h2>
    )
}

export default NotFound