import { useEffect } from "react"
import { useLang } from "../hooks/useLang"

function Home() {
    const { getMessages } = useLang()

    useEffect(() => {
        document.title += " | " + getMessages().home.pageBrowserTitle
    }, [])

    return (
        <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">{getMessages().home.pageTitle}</h2>
    )
}

export default Home