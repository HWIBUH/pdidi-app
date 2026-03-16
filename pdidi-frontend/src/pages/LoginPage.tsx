import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/user-context";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
    const { setUsername } = useUser()
    const [initial, setInitial] = useState("")
    const [error, setError] = useState(false)
    const pattern = /^[A-Z]{2}\d{2}-\d{1,2}$/
    const navigate = useNavigate()

    function handleInput() {
        const usr = initial.trim()
        if(pattern.test(usr)) {
            setError(false)
            setUsername(usr)
            navigate("/menu")
        } {
            setError(true)
        }
    }

    return (
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
                            onChange={(e) => setInitial(e.target.value)}
                        />
                        { error ?
                            <p className="text-red-500">Invalid initial format</p>
                            :
                            null
                        }
                    </div>
                </div>

                <Button
                    className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                    onClick={handleInput}
                >
                    Sign In
                </Button>
            </div>
        </div>
    )
}