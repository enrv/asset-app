import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom"

import { AuthProvider } from "./hooks/useAuth"
import { ProtectedRoute } from "./components/ProtectedRoute"

import Header from "./components/Header"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Register from "./pages/Register"
import ClientDashboard from "./pages/ClientDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import Companies from "./pages/Companies"
import NotFound from "./pages/NotFound"

function Routing() {
    return (
        <AuthProvider>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
                <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:code" element={<Companies />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </AuthProvider>
    )
}

export default Routing