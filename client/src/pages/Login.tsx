import { useState, useEffect } from "react"

function Login() {
    useEffect(() => {
        document.title += " | Login"
    }, [])

    const [ userType, setUserType ] = useState("client")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ loginHasFailed, setLoginHasFailed ] = useState(false)

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
            })
            .then(data => {
                setLoginHasFailed(false)
                localStorage.setItem("access_token", data.access_token)
                localStorage.setItem("user_info", JSON.stringify({
                    "kindofuser": userType,
                    "email": email,
                    "first_name": data.first_name,
                    "last_name": data.last_name
                }))
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
            <form id="login">
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
                    <button onClick={submitLogin}>Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login