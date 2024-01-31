import { createContext, useContext, useMemo } from "react"
import { useLocalStorage } from "./useLocalStorage"

interface UserInfo {
    token: string
    kindofuser: string
    email: string
    first_name: string
    last_name: string
}

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null)

    const login = (info: UserInfo) => {
        setUser(info)
    }

    const logout = () => {
        setUser(null)
    }

    const value = useMemo(() => ({user, login, logout}), [user])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context
}

export { AuthProvider, useAuth }