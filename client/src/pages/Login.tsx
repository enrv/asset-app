import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"

function Login() {
    useEffect(() => {
        document.title += " | Login"
    }, [])

    const [ userType, setUserType ] = useState("client")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ loginHasFailed, setLoginHasFailed ] = useState(false)

    const { login, user } = useAuth()

    if (user) {
        return <Navigate to="/" />
    }

    const submitLogin = (e) => {
        const requestInfo = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "kindofuser": userType,
                "email": email,
                "password": password
            })
        }
        
        fetch("/api/login", requestInfo)
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                }
                throw new Error("User or password incorrect")
            })
            .then(data => {
                login({
                    "token": data.access_token,
                    "kindofuser": userType,
                    "email": email,
                    "first_name": data.first_name,
                    "last_name": data.last_name
                })
            })
            .catch(error => {
                setLoginHasFailed(true)
                console.error(error)
            })

        e.preventDefault()
    }

    return (
        <div>
        <h2>Login</h2>
            {loginHasFailed &&
                <div>
                    <p>User or password incorrect</p>
                </div>
            }
            <form onSubmit={submitLogin}>
                <div>
                    <label>
                        <input type="radio" id="client" value="client" checked={userType == "client"} onChange={() => setUserType("client")} />
                        Client
                    </label>
                    <label>
                        <input type="radio" id="manager" value="manager" checked={userType == "manager"} onChange={() => setUserType("manager")} />
                        Manager
                    </label>
                </div>
                <div>
                    <input type="text" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <button>Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login