import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/service/auth.service";
import { useUser } from "@/context/user-context";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import { type LoginResponse } from "@/dtos/login.dto";

export default function LoginPage() {
    const [initial, setInitial] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
    const [adminCandidate, setAdminCandidate] = useState<LoginResponse>()
    const navigate = useNavigate()
    const { setUser } = useUser()

    async function handleInput() {
        if (!initial.trim()) {
            setError("Please enter your initial")
            return
        }

        setLoading(true)
        setError("")

        try {
            const user = await login({ username: initial })
            
            if (user.role === 'admin') {
                setAdminCandidate(user)
                setIsAdminModalOpen(true)
            } else {
                setUser({
                    id: user.userId,
                    username: user.username,
                    role: user.role
                })
                navigate("/menu")
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    const handleAdminSuccess = () => {
        if(!adminCandidate) return
        setUser({
            id: adminCandidate.userId,
            username: adminCandidate.username,
            role: adminCandidate.role
        })
        navigate("/admin/dashboard")
    }

    return (
        <>
            <div className="w-full h-full flex justify-center items-center px-4">
                <div className="flex flex-col w-full max-w-sm rounded-lg shadow-sm border border-gray-300 p-8 gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                        <p className="text-sm text-gray-600">Sign in to your account</p>
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
                                    setInitial(e.target.value.toUpperCase())
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
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Register
                        </Link>
                    </div>
                </div>
            </div>

            <AdminPasswordModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                onSuccess={handleAdminSuccess}
            />
        </>
    )
}