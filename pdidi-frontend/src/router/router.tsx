import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/pages/Layout'
import LoginPage from '@/pages/LoginPage'
import MenuPage from '@/pages/MenuPage'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminTransaction from '@/pages/AdminTransaction'
import RegisterPage from '@/pages/RegisterPage'

export const route = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <LoginPage />
            },
            {
                path: '/register',
                element: <RegisterPage />
            },
            {
                path: '/menu',
                element: <MenuPage />
            },
            {
                path: "/admin/dashboard",
                element: <AdminDashboard />
            },
            {
                path: "admin/transaction",
                element: <AdminTransaction />
            }
        ]
    }
])