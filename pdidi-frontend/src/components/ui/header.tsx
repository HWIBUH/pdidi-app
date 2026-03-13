export default function Header(
    {user} : {user?:string}
) {
    return (
        <div className="w-full flex items-center justify-between py-5 border border-bottom">
            <div className="flex flex-col">
                <h1 className="text-2xl bold">Pdidi</h1>
            </div>
            <div>
                <p>{user}</p>
            </div>
        </div>
    )
}