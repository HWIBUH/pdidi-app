import { useState, useEffect } from "react";
import { getBalance, addBalance, subtractBalance, getOrders, toggleOrder, deleteOrder } from "@/service/admin.service";
import { createDiscount } from "@/service/discount.service";
import type { BalanceResponse } from "@/dtos/balance.dto";
import type { OrderResponse } from "@/dtos/order.dto";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { formatDateLocal } from "@/utils/format-date";

export default function AdminDashboard() {
    const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null)
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [amount, setAmount] = useState("")
    const [operationLoading, setOperationLoading] = useState(false)
    const [toggleLoading, setToggleLoading] = useState<number | null>(null)
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

    const [discountRate, setDiscountRate] = useState("")
    const [slotQuantity, setSlotQuantity] = useState("")
    const [validUntil, setValidUntil] = useState("")
    const [discountLoading, setDiscountLoading] = useState(false)

    const navigate = useNavigate()

    const fetchData = () => {
        Promise.all([
            getBalance(),
            getOrders()
        ])
            .then(([balanceRes, ordersRes]) => {
                setBalanceData(balanceRes)
                setOrders(ordersRes)
            })
            .catch(err => setError(err.response?.data?.error || "Failed to load data"))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleToggleOrder = async (orderId: number) => {
        setToggleLoading(orderId)
        try {
            await toggleOrder(orderId)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to toggle order")
        } finally {
            setToggleLoading(null)
        }
    }

    const handleDeleteOrder = async (orderId: number) => {
        if (!window.confirm("Are you sure you want to delete this order?")) {
            return
        }
        setDeleteLoading(orderId)
        try {
            await deleteOrder(orderId)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to delete order")
        } finally {
            setDeleteLoading(null)
        }
    }

    const handleAdd = async () => {
        if (!amount || isNaN(Number(amount))) {
            setError("Please enter a valid amount")
            return
        }
        setError(null)
        setOperationLoading(true)
        try {
            await addBalance({ amount: Number(amount) })
            setAmount("")
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add balance")
        } finally {
            setOperationLoading(false)
        }
    }

    const handleSubtract = async () => {
        if (!amount || isNaN(Number(amount))) {
            setError("Please enter a valid amount")
            return
        }
        setError(null)
        setOperationLoading(true)
        try {
            await subtractBalance({ amount: Number(amount) })
            setAmount("")
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to subtract balance")
        } finally {
            setOperationLoading(false)
        }
    }

    const handleCreateDiscount = async () => {
        if (!discountRate || !slotQuantity || !validUntil) {
            setError("Please fill in all discount fields")
            return
        }

        if (isNaN(Number(discountRate)) || isNaN(Number(slotQuantity))) {
            setError("Please enter valid numbers")
            return
        }

        setError(null)
        setDiscountLoading(true)
        try {
            await createDiscount({
                discountRate: Number(discountRate),
                slotQuantity: Number(slotQuantity),
                validUntil: new Date(validUntil)
            })
            setDiscountRate("")
            setSlotQuantity("")
            setValidUntil("")
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create discount")
        } finally {
            setDiscountLoading(false)
        }
    }

    if (loading) return <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-muted">Loading...</p></div>

    const lastUpdated = balanceData?.updatedAt
        ? new Date(balanceData.updatedAt).toLocaleString()
        : 'Never'

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-canvas">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight text-ink">Dashboard</h1>
                    <button
                        onClick={() => navigate("/admin/manage")}
                        className="h-9 px-4 rounded-lg bg-surface-card text-ink text-sm font-medium transition-colors hover:bg-surface-card inline-flex items-center gap-1.5"
                    >
                        Manage <ChevronRight className="size-4" />
                    </button>
                </div>

                {error && <p className="text-error text-sm">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl bg-surface-card p-5">
                        <h2 className="text-sm font-semibold text-ink">Balance</h2>
                        <p className="text-3xl font-bold text-primary mt-2">Rp {balanceData?.balance?.toLocaleString()}</p>
                        <p className="text-xs text-muted mt-1">Last updated: {lastUpdated}</p>

                        <div className="mt-5 space-y-3">
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={operationLoading}
                                className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAdd}
                                    disabled={operationLoading}
                                    className="flex-1 h-9 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active disabled:opacity-50"
                                >
                                    {operationLoading ? "Processing..." : "Add"}
                                </button>
                                <button
                                    onClick={handleSubtract}
                                    disabled={operationLoading}
                                    className="flex-1 h-9 rounded-lg border border-hairline bg-canvas text-ink text-sm font-medium transition-colors hover:bg-surface-card disabled:opacity-50"
                                >
                                    {operationLoading ? "Processing..." : "Subtract"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-surface-card p-5">
                        <h2 className="text-sm font-semibold text-ink">Create discount</h2>

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="text-xs text-muted font-medium block mb-1">Discount rate (%)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 15"
                                    value={discountRate}
                                    onChange={(e) => setDiscountRate(e.target.value)}
                                    disabled={discountLoading}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted font-medium block mb-1">Slot quantity</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 50"
                                    value={slotQuantity}
                                    onChange={(e) => setSlotQuantity(e.target.value)}
                                    disabled={discountLoading}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted font-medium block mb-1">Valid until</label>
                                <input
                                    type="datetime-local"
                                    value={validUntil}
                                    onChange={(e) => setValidUntil(e.target.value)}
                                    disabled={discountLoading}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm focus:outline-none focus:border-primary transition-colors"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => setValidUntil(formatDateLocal(10))} className="flex-1 h-7 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-surface-card">+10m</button>
                                    <button onClick={() => setValidUntil(formatDateLocal(15))} className="flex-1 h-7 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-surface-card">+15m</button>
                                    <button onClick={() => setValidUntil(formatDateLocal(20))} className="flex-1 h-7 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-surface-card">+20m</button>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateDiscount}
                                disabled={discountLoading}
                                className="w-full h-9 rounded-lg bg-accent-teal text-white text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                            >
                                {discountLoading ? "Creating..." : "Create discount"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-surface-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-hairline">
                        <h2 className="text-sm font-semibold text-ink">Recent orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-hairline">
                                    <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">ID</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">User</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Menu</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Price</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Status</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <tr key={order.id} className="border-b border-hairline hover:bg-canvas/50 transition-colors">
                                            <td className="px-5 py-3.5 text-ink">{order.id}</td>
                                            <td className="px-5 py-3.5 text-ink">{order.user?.username}</td>
                                            <td className="px-5 py-3.5 text-ink">{order.menu?.name}</td>
                                            <td className="px-5 py-3.5 text-ink">Rp {order.total_price.toLocaleString()}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-medium ${order.done ? 'text-success' : 'text-warning'}`}>
                                                    {order.done ? 'Done' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-muted text-xs">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => handleToggleOrder(order.id)}
                                                        disabled={toggleLoading === order.id}
                                                        className={`h-7 px-2.5 rounded-md text-xs font-medium transition-colors ${order.done
                                                            ? 'bg-white border border-hairline text-muted hover:bg-surface-card'
                                                            : 'bg-primary text-on-primary hover:bg-primary-active'
                                                        } disabled:opacity-50`}
                                                    >
                                                        {toggleLoading === order.id ? '...' : order.done ? 'Undo' : 'Done'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        disabled={deleteLoading === order.id}
                                                        className="h-7 px-2.5 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-error hover:text-white hover:border-error disabled:opacity-50"
                                                    >
                                                        {deleteLoading === order.id ? '...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-muted text-xs">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
