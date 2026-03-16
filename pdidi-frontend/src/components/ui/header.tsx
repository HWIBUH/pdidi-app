export default function Header(
    {user} : {user:string | null}
) {
    return (
        <div className="w-full flex items-center justify-between py-5 px-6 border-b border-gray-200">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-800">Pdidi</h1>
            </div>
            <div>
                <p className="text-gray-600">{user}</p>
            </div>
        </div>
    )
}