import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/pages/Layout'
import LoginPage from '@/pages/LoginPage'
import MenuPage from '@/pages/MenuPage'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminTransaction from '@/pages/AdminTransaction'
import RegisterPage from '@/pages/RegisterPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminRoute } from '@/components/AdminRoute'
import AdminManage from '@/pages/AdminManage'

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
                element: <ProtectedRoute><MenuPage /></ProtectedRoute>
            },
            {
                path: "/admin/dashboard",
                element: <AdminRoute><AdminDashboard /></AdminRoute>
            },
            {
                path: "/admin/transaction",
                element: <AdminRoute><AdminTransaction /></AdminRoute>
            },
            {
                path: "/admin/manage",
                element: <AdminRoute><AdminManage /></AdminRoute>
            }
        ]
    }
])