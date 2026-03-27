import { Button } from "./button";
import { logout } from "@/service/auth.service";
import { useNavigate } from "react-router";

export default function Header(
    { user }: { user: string | undefined }
) {
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="w-full flex items-center justify-between py-5 px-6 border-b border-gray-200">
            <div className="flex flex-col">
                <img src={`${import.meta.env.BASE_URL}catevings256.png`} alt="CatEVinGS" className="h-10 w-auto" />
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <p className="text-gray-600 animate-bounce">Hello <strong>{user}</strong>!</p>

                        <Button
                            onClick={handleLogout}
                            className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                        >
                            Logout
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}