import { useState, useEffect } from "react";
import { getBalance, addBalance, subtractBalance, getOrders, toggleOrder, deleteOrder } from "@/service/admin.service";
import { createDiscount } from "@/service/discount.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

    if (loading) return <div className="p-6">Loading...</div>

    const lastUpdated = balanceData?.updatedAt
        ? new Date(balanceData.updatedAt).toLocaleString()
        : 'Never'

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Button
                    onClick={() => navigate("/admin/manage")}
                    className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                >
                    Manage <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            {error && <div className="p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>}
            <div className="flex justify-center gap-6">
                <div className="bg-white rounded-lg shadow p-6 max-w-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Balance</h2>
                    <p className="text-4xl font-bold text-blue-600">Rp.{balanceData?.balance?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>

                    <div className="mt-6 flex flex-col gap-4">
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={operationLoading}
                            className="h-10"
                        />

                        <div className="flex gap-2">
                            <Button
                                onClick={handleAdd}
                                disabled={operationLoading}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                {operationLoading ? "Processing..." : "Add"}
                            </Button>
                            <Button
                                onClick={handleSubtract}
                                disabled={operationLoading}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                {operationLoading ? "Processing..." : "Subtract"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 max-w-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Discount</h2>

                    <div className="flex flex-col gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Discount Rate (%)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 15"
                                value={discountRate}
                                onChange={(e) => setDiscountRate(e.target.value)}
                                disabled={discountLoading}
                                className="h-10 mt-1"
                                min="0"
                                max="100"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700">Slot Quantity</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 50"
                                value={slotQuantity}
                                onChange={(e) => setSlotQuantity(e.target.value)}
                                disabled={discountLoading}
                                className="h-10 mt-1"
                                min="1"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700">Valid Until</Label>
                            <Input
                                type="datetime-local"
                                value={validUntil}
                                onChange={(e) => setValidUntil(e.target.value)}
                                disabled={discountLoading}
                                className="h-10 mt-1"
                            />
                            <div className="flex gap-2">
                                <Button onClick={() => setValidUntil(formatDateLocal(10))} className="flex-1 text-xs bg-gray-500 hover:bg-gray-600 text-white">+10m</Button>
                                <Button onClick={() => setValidUntil(formatDateLocal(15))} className="flex-1 text-xs bg-gray-500 hover:bg-gray-600 text-white">+15m</Button>
                                <Button onClick={() => setValidUntil(formatDateLocal(20))} className="flex-1 text-xs bg-gray-500 hover:bg-gray-600 text-white">+20m</Button>
                            </div>
                        </div>

                        <Button
                            onClick={handleCreateDiscount}
                            disabled={discountLoading}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {discountLoading ? "Creating..." : "Create Discount"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Menu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.user?.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.menu?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">Rp. {order.total_price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.done
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-300 text-red-800'
                                                }`}>
                                                {order.done ? 'Done' : 'Not Done'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Button
                                                onClick={() => handleToggleOrder(order.id)}
                                                disabled={toggleLoading === order.id}
                                                className={`px-3 py-1 text-xs rounded font-medium ${order.done
                                                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                {toggleLoading === order.id ? 'Updating...' : order.done ? 'Mark Not Done' : 'Mark Done'}
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                disabled={deleteLoading === order.id}
                                                className={`px-3 py-1 text-xs rounded font-medium bg-red-600 hover:bg-red-700 text-white`}
                                            >
                                                {deleteLoading === order.id ? 'Deleting...' : 'Delete Order'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}