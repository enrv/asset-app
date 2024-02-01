import { useEffect, useState } from "react"

function Register() {
    useEffect(() => {
        document.title += " | Register"
    }, [])

    const [ userType, setUserType ] = useState("client")
    const [ firstName, setFirstName ] = useState("")
    const [ lastName, setLastName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ zipCode, setZipCode ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ passwordConfirmation, setPasswordConfirmation ] = useState("")
    const [ registerHasFailed, setRegisterHasFailed ] = useState(false)
    const [ passwordMismatch, setPasswordMismatch ] = useState(false)
    const [ ableToLogin, setAbleToLogin ] = useState(false)

    const submitRegister = (e) => {
        e.preventDefault()

        if (password != passwordConfirmation) {
            setPasswordMismatch(true)
            return
        } else {
            setPasswordMismatch(false)
        }

        const requestInfo = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "kindofuser": userType,
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "zip": zipCode,
                "password": password
            })
        }
        
        fetch("/api/register", requestInfo)
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                }
                throw new Error("User not registered")
            })
            .then(() => {
                setAbleToLogin(true)
                setRegisterHasFailed(false)
            })
            .catch(error => {
                setAbleToLogin(false)
                setRegisterHasFailed(true)
                console.error(error)
            })
    }

    return (
        <div>
            <h2>Register</h2>
            {registerHasFailed &&
                <div>
                    <p>User not registered</p>
                </div>
            }
            {passwordMismatch &&
                <div>
                    <p>Passwords do not match</p>
                </div>
            }
            {ableToLogin &&
                <div>
                    <p>User registered. Please login</p>
                </div>
            }
            <form onSubmit={submitRegister}>
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
                    <input type="text" placeholder="first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                    <input type="text" placeholder="last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div>
                    <input type="text" placeholder="zip code" value={zipCode} onChange={e => setZipCode(e.target.value)} />
                </div>
                <div>
                    <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <input type="password" placeholder="confirm password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}

export default Register