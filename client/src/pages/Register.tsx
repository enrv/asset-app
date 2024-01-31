import { useEffect } from "react"

function Register() {
    useEffect(() => {
        document.title += " | Register"
    }, [])

    return (
        <h2>Register</h2>
    )
}

export default Register