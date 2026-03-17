import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronsDown, ChevronsUp, Search, Utensils } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllMenus } from "@/service/menu.service";
import { createOrder } from "@/service/order.service";
import { type Menu } from "@/model/menu.model";
import { useNavigate } from "react-router";
import { useUser } from "@/context/user-context";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";

type SortOption = {
    label: string
    value: number
}

export default function MenuPage() {
    const maxPrice = 50000
    const [menus, setMenus] = useState<Menu[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [order, setOrder] = useState(true)
    const [sort, setSort] = useState(1)
    const [priceFilter, setPriceFilter] = useState(maxPrice)
    const [searchQuery, setSearchQuery] = useState("")
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
    const [orderLoading, setOrderLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useUser()

    useEffect(() => {
        getAllMenus()
            .then(setMenus)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const handleOrderClick = (menu: Menu) => {
        setSelectedMenu(menu)
        setShowConfirmationModal(true)
    }

    const handleCreateOrder = async () => {
        if (!selectedMenu || !user?.id) return
        console.log("Creating order with:", {
            user_id: user.id,
            menu_id: selectedMenu.id,
            total_price: selectedMenu.price
        })

        setOrderLoading(true)
        try {
            await createOrder({
                user_id: user.id,
                menu_id: selectedMenu.id,
                total_price: selectedMenu.price
            })
            setShowConfirmationModal(false)
            setSelectedMenu(null)
            navigate("/orders")
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create order")
        } finally {
            setOrderLoading(false)
        }
    }

    const sortOptions: SortOption[] = [
        { label: "Price", value: 1 },
        { label: "Name", value: 2 }
    ]

    const filteredMenus = menus
        .filter(menu => {
            const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesPrice = menu.price <= priceFilter
            return matchesSearch && matchesPrice
        })
        .sort((a, b) => {
            let compareValue = 0
            if (sort === 1) {
                compareValue = a.price - b.price
            } else {
                compareValue = a.name.localeCompare(b.name)
            }
            return order ? compareValue : -compareValue
        })

    if (loading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-gray-500">Loading menus...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Button
                    onClick={() => navigate("/orders")}
                    className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                >
                    My Orders <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            <div className="w-full h-full flex justify-center pt-8 mx-auto">
                <div className="w-8/10 max-w-7xl grid grid-cols-8 grid-rows-8 gap-6 px-4">
                    <div className="row-span-1 col-span-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full max-w-md flex items-center">
                            <Search className="absolute left-3 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search menu..."
                                className="h-10 pl-9 pr-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 h-10 px-4 rounded-md transition-colors"
                                onClick={() => setOrder(!order)}
                            >
                                {order ? (
                                    <><ChevronsUp className="w-4 h-4" /> <p>Asc</p></>
                                ) : (
                                    <><ChevronsDown className="w-4 h-4" /> <p>Desc</p></>
                                )}
                            </Button>

                            <div className="w-48">
                                <Combobox
                                    items={sortOptions}
                                    itemToStringValue={(sortOption: SortOption) => sortOption.label}
                                    onValueChange={(e) => setSort(e?.value || 1)}
                                >
                                    <ComboboxInput
                                        placeholder="Sort by..."
                                        className="h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>No options found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item: SortOption) => (
                                                <ComboboxItem
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                        </div>
                    </div>

                    <div className="w-full col-span-8 row-span-7 grid grid-cols-8 gap-6">

                        <div className="col-span-6 overflow-y-scroll">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredMenus.length > 0 ? (
                                    filteredMenus.map(item => (
                                        <div key={item.id} className={`border rounded-lg overflow-hidden flex flex-col gap-0 hover:shadow-lg transition-shadow bg-white ${!item.available ? 'opacity-60 border-gray-300' : 'border-gray-200 hover:shadow-lg'
                                            }`}>
                                            <div className="w-full h-40 bg-linear-to-br from-gray-100 to-gray-50 rounded-t-lg flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Utensils className="text-6xl text-gray-400" />
                                                )}
                                            </div>

                                            <div className="flex flex-col flex-1 p-4 gap-3">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{item.name}</h3>
                                                    {item.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className="text-lg font-bold text-blue-600">Rp {item.price.toLocaleString()}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.available
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {item.available ? 'Available' : 'Out'}
                                                    </span>
                                                </div>

                                                <Button
                                                    className={`w-full h-9 rounded-md font-medium transition-all text-sm ${item.available
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    onClick={() => handleOrderClick(item)}
                                                    disabled={!item.available}
                                                >
                                                    {item.available ? "Order" : "Unavailable"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500">No menus found</p>
                                )}
                            </div>
                        </div>

                        <div className="col-span-2 p-6 rounded-lg shadow-sm border border-gray-300 flex flex-col gap-6 self-start h-fit">
                            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Max Price: {priceFilter}
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        value={priceFilter}
                                        onChange={(e) => setPriceFilter(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                                        <span>0</span>
                                        <span>{maxPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <OrderConfirmationModal
                isOpen={showConfirmationModal}
                selectedMenu={selectedMenu}
                onConfirm={handleCreateOrder}
                onCancel={() => {
                    setShowConfirmationModal(false)
                    setSelectedMenu(null)
                }}
                isLoading={orderLoading}
            />
        </div>
    )
}