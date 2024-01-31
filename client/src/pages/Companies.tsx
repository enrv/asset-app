import { useEffect } from "react"
import { useParams } from "react-router-dom"

function Companies() {
    let params = useParams()

    useEffect(() => {
        if (params.code) {
            document.title += " | Company " + params.code
        } else {
            document.title += " | Companies"
        }
    }, [])

    if (params.code) {
        return <h2>Company {params.code}</h2>
    } else {
        return <h2>Companies</h2>
    }
}

export default Companies