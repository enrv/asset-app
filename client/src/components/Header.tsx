import { useAuth } from "../hooks/useAuth"
import { Button } from "./ui/button"

function Header() {
    const { user } = useAuth()

    return (
        <header className="border-b pt-8 pb-8">
            <h1 className="float-left text-4xl font-extrabold tracking-tight lg:text-5xl">Minha Asset</h1>
            {user ? (
                <div className="float-right flex pt-2">
                    <h4 className="text-2xl font-semibold tracking-tight">Welcome, {user.first_name} {user.last_name}!</h4>
                    <Button className="ml-4"><a href="/logout">Logout</a></Button>
                </div>
            ) : (
                <div className="float-right flex pt-2">
                    <Button><a href="/login">Login</a></Button>
                    <Button className="ml-4"><a href="/register">Register</a></Button>
                </div>
            )}
        </header>
    )
}

export default Header