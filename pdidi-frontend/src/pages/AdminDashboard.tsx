import { useState, useEffect } from "react";
import { getBalance, addBalance, subtractBalance } from "@/service/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BalanceResponse } from "@/dtos/balance.dto";

export default function AdminDashboard() {
    const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [amount, setAmount] = useState("")
    const [operationLoading, setOperationLoading] = useState(false)

    const fetchBalance = () => {
        getBalance()
            .then(data => setBalanceData(data))
            .catch(err => setError(err.response?.data?.error || "Failed to load balance"))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchBalance()
    }, [])

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
            fetchBalance()
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
            fetchBalance()
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
        <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6 max-w-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Balance</h2>
                <p className="text-4xl font-bold text-blue-600">Rp.{balanceData?.balance?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
                {error && <div className="p-6 text-red-500">Error: {error}</div>}

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
        </div>
    )
}