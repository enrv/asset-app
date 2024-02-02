import { useEffect } from "react"

function Home() {
    useEffect(() => {
        document.title += " | Home"
    }, [])

    return (
        <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Home</h2>
    )
}

export default Home