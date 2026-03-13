import AdminDashboard from "@/pages/AdminDashboard"
import AdminLogin from "@/pages/AdminLogin"
import AdminTransaction from "@/pages/AdminTransaction"
import LoginPage from "@/pages/LoginPage"
import MenuPage from "@/pages/MenuPage"
import { createBrowserRouter } from "react-router-dom"

export const route = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>
    },
    {
        path: "/menu",
        element: <MenuPage/>
    },
    {
        path: "/admin/login",
        element: <AdminLogin/>
    },
    {
        path: "/admin/dashboard",
        element: <AdminDashboard/>
    },
    {
        path: "admin/transaction",
        element: <AdminTransaction/>
    }
])