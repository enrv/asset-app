import {
    Routes,
    Route
} from "react-router-dom"

import { AuthProvider } from "./hooks/useAuth"
import { ProtectedRoute, ProtectionType } from "./components/ProtectedRoute"
import { LangProvider } from "./hooks/useLang"

import Header from "./components/Header"
import Footer from "./components/Footer"
import Sidebar from "./components/Sidebar"

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
        <LangProvider>
            <div className="flex flex-col h-screen justify-between mx-20">
                <Header />
                <div className="flex">
                <aside className="h-screen sticky top-0 pt-10">
                    <Sidebar />
                </aside>
                <main className="mb-auto h-30 pt-10 pl-10 pb-80">
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
                </main>
                </div>
                <Footer />
            </div>
        </LangProvider>
        </AuthProvider>
    )
}

export default Routing