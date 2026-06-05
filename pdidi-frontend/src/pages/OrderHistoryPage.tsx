import { useState, useEffect } from "react";
import { getOrdersByUserId } from "@/service/order.service";
import type { OrderResponse } from "@/dtos/order.dto";
import { useUser } from "@/context/user-storage";
import { ChevronLeft, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

    if (loading) return <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-muted">Loading...</p></div>

    return (
        <div className="px-4 py-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => navigate("/menu")}
                    className="h-9 px-3 rounded-lg bg-surface-card text-muted text-sm font-medium transition-colors hover:bg-surface-card inline-flex items-center gap-1.5"
                >
                    <ChevronLeft className="size-4" /> Menu
                </button>
                <h1 className="text-2xl font-semibold tracking-tight text-ink">My orders</h1>
            </div>

            {error && <p className="text-error text-sm mb-4">{error}</p>}

            <div className="rounded-xl bg-surface-card overflow-hidden">
                {orders.length > 0 ? (
                    orders.map((order, i) => (
                        <div
                            key={order.id}
                            className={`px-5 py-4 flex items-center gap-4 ${i < orders.length - 1 ? 'border-b border-hairline' : ''}`}
                        >
                            <div className={`shrink-0 ${order.done ? 'text-success' : 'text-muted'}`}>
                                {order.done ? <CheckCircle className="size-5" /> : <Clock className="size-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-ink truncate">{order.menu?.name || `Order #${order.id}`}</p>
                                <p className="text-xs text-muted mt-0.5">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-primary">Rp {order.total_price.toLocaleString()}</p>
                                <p className={`text-xs font-medium mt-0.5 ${order.done ? 'text-success' : 'text-muted'}`}>
                                    {order.done ? 'Completed' : 'Pending'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-5 py-12 text-center text-muted text-sm">No orders yet</div>
                )}
            </div>
        </div>
    )
}
