import { useState, useEffect } from "react";
import { getOrdersByUserId } from "@/service/order.service";
import type { OrderResponse } from "@/dtos/order.dto";
import { useUser } from "@/context/user-storage";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrderHistoryPage() {
    const { user } = useUser()
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user?.id) return

        getOrdersByUserId(user.id)
            .then(setOrders)
            .catch(err => setError(err.response?.data?.error || "Failed to load orders"))
            .finally(() => setLoading(false))
    }, [user?.id])

    if (loading) return <div className="p-6">Loading...</div>

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    onClick={() => navigate("/menu")}
                    className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> Menu
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                    {error && <div className="p-6 text-red-500">{error}</div>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Menu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.menu?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">Rp. {order.total_price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.done
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {order.done ? 'Completed' : 'Not Completed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No orders yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}