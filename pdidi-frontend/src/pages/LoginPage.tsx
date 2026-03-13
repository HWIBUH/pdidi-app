import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    return (
        <div className="w-full h-screen flex flex-col bg-gray-50">
            <Header/>

            <div className="flex flex-1 justify-center items-center px-4">
                <div className="flex flex-col w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-100 p-8 gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                        <p className="text-sm text-gray-600">Sign in to your account</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <Input
                                className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <Input
                                className="h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="password"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <Button
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                    >
                        Sign In
                    </Button>
                </div>
            </div>

            <Footer/>
        </div>
    )
}
