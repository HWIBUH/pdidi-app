import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/service/auth.service";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function RegisterPage() {
    const [initial, setInitial] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleInput() {
        if (!initial.trim()) {
            setError("Please enter your initial")
            return
        }

        setLoading(true)
        setError("")

        try {
            await register({ username: initial })
            navigate("/")
        } catch (err: any) {
            setError(err.response?.data?.error || "Register failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full h-full flex justify-center items-center px-4">
            <div className="flex flex-col w-full max-w-sm rounded-lg shadow-sm border border-gray-300 p-8 gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold text-gray-900">Welcome</h2>
                    <p className="text-sm text-gray-600">Register your account</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-gray-700">Initial</Label>
                        <Input
                            className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="e.g. GS25-1"
                            autoComplete="off"
                            value={initial}
                            onChange={(e) => {
                                setInitial(e.target.value)
                                setError("")
                            }}
                            disabled={loading}
                        />
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                    </div>
                </div>

                <Button
                    className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                    onClick={handleInput}
                    disabled={loading}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}