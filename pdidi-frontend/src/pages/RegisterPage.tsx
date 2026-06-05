import { useUser } from "@/context/user-storage";
import { register } from "@/service/auth.service";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function RegisterPage() {
    const [initial, setInitial] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useUser()

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
            await register({ username: initial })
            navigate("/")
        } catch (err: any) {
            setError(err.response?.data?.error || "Register failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-xl bg-surface-dark p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-on-dark">Create account</h1>
                    <p className="text-sm text-on-dark-soft mt-1">Register your initial</p>
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
                        {loading ? "Registering..." : "Register"}
                    </button>
                </div>

                <p className="text-center text-sm text-on-dark-soft mt-6">
                    Already have an account?{' '}
                    <Link to="/" className="text-primary hover:text-primary-active font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
