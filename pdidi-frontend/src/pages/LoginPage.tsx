import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/service/auth.service";
import { useUser } from "@/context/user-storage";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import { type LoginResponse } from "@/dtos/login.dto";

export default function LoginPage() {
    const [initial, setInitial] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
    const [adminCandidate, setAdminCandidate] = useState<LoginResponse>()
    const navigate = useNavigate()
    const { user, setUser } = useUser()

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin/dashboard', { replace: true })
            else navigate('/menu', { replace: true })
        }
    }, [user])

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
        if (!adminCandidate) return
        setUser({
            id: adminCandidate.userId,
            username: adminCandidate.username,
            role: adminCandidate.role
        })
        navigate("/admin/dashboard")
    }

    return (
        <>
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <div className="w-full max-w-sm rounded-xl bg-surface-dark p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold tracking-tight text-on-dark">Welcome back</h1>
                        <p className="text-sm text-on-dark-soft mt-1">Sign in to continue</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-on-dark-soft mb-1.5">Initial</label>
                            <input
                                className="w-full h-10 px-3 rounded-lg bg-surface-dark-elevated border border-[#333] text-on-dark text-sm placeholder:text-on-dark-soft focus:outline-none focus:border-primary transition-colors"
                                type="text"
                                placeholder="e.g. GS25-1"
                                autoComplete="off"
                                value={initial}
                                onChange={(e) => {
                                    setInitial(e.target.value.toUpperCase())
                                    setError("")
                                }}
                                disabled={loading}
                                onKeyDown={(e) => e.key === 'Enter' && handleInput()}
                            />
                            {error && (
                                <p className="text-error text-sm mt-1.5">{error}</p>
                            )}
                        </div>

                        <button
                            className="w-full h-10 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active disabled:opacity-50"
                            onClick={handleInput}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-on-dark-soft mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-active font-medium">
                            Register
                        </Link>
                    </p>
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
