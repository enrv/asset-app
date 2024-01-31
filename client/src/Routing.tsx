import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom"

import { createContext } from "react"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Logout from "./Logout"
import Register from "./pages/Register"
import ClientDashboard from "./pages/ClientDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import Companies from "./pages/Companies"
import NotFound from "./pages/NotFound"

function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/client" element={<ClientDashboard />} />
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:code" element={<Companies />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Routing