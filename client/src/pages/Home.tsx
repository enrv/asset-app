import { useEffect } from "react"

function Home() {
    useEffect(() => {
        document.title += " | Home"
    }, [])

    return (
        <h2>Homepage</h2>
    )
}

export default Home