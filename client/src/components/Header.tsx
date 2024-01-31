function Header() {
    const token = localStorage.getItem("access_token")
    const userInfo = localStorage.getItem("user_info")

    if (token && userInfo) {
        const user = JSON.parse(userInfo)
        return (
            <div>
                <h1>Minha Asset</h1>
                <div>
                <h2>Welcome, {user.first_name} {user.last_name}!</h2>
                <a href="/logout">Logout</a>
            </div>
            </div>
        )
        } else {
            return (
                <div>
                    <h1>Minha Asset</h1>
                    <p><a href="/login">Login</a></p>
                    <p><a href="/register">Register</a></p>
                </div>
            )
        }
}

export default Header