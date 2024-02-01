import {
    Routes,
    Route
} from "react-router-dom"

import { AuthProvider } from "./hooks/useAuth"
import { ProtectedRoute, ProtectionType } from "./components/ProtectedRoute"

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
                <Route path="/login" element={<ProtectedRoute type={ProtectionType.NotLoggedIn}><Login /></ProtectedRoute>} />
                <Route path="/logout" element={<ProtectedRoute type={ProtectionType.ClientOrManager}><Logout /></ProtectedRoute>} />
                <Route path="/register" element={<ProtectedRoute type={ProtectionType.NotLoggedIn}><Register /></ProtectedRoute>} />
                <Route path="/client" element={<ProtectedRoute type={ProtectionType.ClientOnly}><ClientDashboard /></ProtectedRoute>} />
                <Route path="/manager" element={<ProtectedRoute type={ProtectionType.ManagerOnly}><ManagerDashboard /></ProtectedRoute>} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:code" element={<Companies />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </AuthProvider>
    )
}

export default Routing