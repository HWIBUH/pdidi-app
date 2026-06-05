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
        <header className="w-full flex items-center justify-between px-6 py-4 border-b border-hairline bg-canvas">
            <img
                src={`${import.meta.env.BASE_URL}catevings256.png`}
                alt="CatEVinGS"
                className="h-8 w-auto"
            />
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-body">Hello <strong className="text-ink">{user}</strong>!</span>
                    <button
                        onClick={handleLogout}
                        className="h-8 px-3 rounded-md bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    )
}
