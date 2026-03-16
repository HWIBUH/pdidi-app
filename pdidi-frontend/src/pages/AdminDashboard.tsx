import { useState, useEffect } from "react";
import { getBalance, addBalance, subtractBalance, getOrders, toggleOrder } from "@/service/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BalanceResponse } from "@/dtos/balance.dto";
import type { OrderResponse } from "@/dtos/order.dto";

export default function AdminDashboard() {
    const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null)
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [amount, setAmount] = useState("")
    const [operationLoading, setOperationLoading] = useState(false)
    const [toggleLoading, setToggleLoading] = useState<number | null>(null)

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

    if (loading) return <div className="p-6">Loading...</div>

    const lastUpdated = balanceData?.updatedAt 
        ? new Date(balanceData.updatedAt).toLocaleString()
        : 'Never'

    return (
        <div className="p-6 space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>}
            
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
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.done 
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
                                                className={`px-3 py-1 text-xs rounded font-medium ${
                                                    order.done
                                                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                            >
                                                {toggleLoading === order.id ? 'Updating...' : order.done ? 'Mark Not Done' : 'Mark Done'}
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