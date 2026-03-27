import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronsDown, ChevronsUp, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllMenus } from "@/service/menu.service";
import { createOrder } from "@/service/order.service";
import { type Menu } from "@/model/menu.model";
import { useNavigate } from "react-router";
import { useUser } from "@/context/user-storage";
import { getActiveDiscount } from "@/service/discount.service";
import { type DiscountResponse } from "@/dtos/discount.dto";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import { getTimeRemaining } from "@/utils/format-date";
import MenuCard from "@/components/MenuCard";
import SortCombobox from "@/components/SortCombobox";

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
    const [activeDiscount, setActiveDiscount] = useState<DiscountResponse | null>(null)
    const [timeRemaining, setTimeRemaining] = useState<string>("")
    const navigate = useNavigate()
    const { user } = useUser()

    useEffect(() => {
        getActiveDiscount()
            .then(setActiveDiscount)
            .catch(err => console.error("Failed to load discount:", err))

        getAllMenus()
            .then(setMenus)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (activeDiscount) {
            setTimeRemaining(getTimeRemaining(activeDiscount.validUntil))
        }

        const interval = setInterval(() => {
            if (activeDiscount) {
                setTimeRemaining(getTimeRemaining(activeDiscount.validUntil))
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [activeDiscount])


    const handleOrderClick = (menu: Menu) => {
        setSelectedMenu(menu)
        setShowConfirmationModal(true)
    }

    const handleCreateOrder = async () => {
        if (!selectedMenu || !user?.id) return

        setOrderLoading(true)
        try {
            await createOrder({
                user_id: user.id,
                menu_id: selectedMenu.id,
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
        <div className="h-9/10 p-2">
            <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Button
                    onClick={() => navigate("/orders")}
                    className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                >
                    My Orders <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {activeDiscount && (
                <div className="col-span-8 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mt-6 mb-6 shadow-sm">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-amber-900 text-xl">Discount!</h3>
                            </div>
                            <p className="text-amber-800 text-sm mb-2">enjoy <span className="font-bold text-lg">{activeDiscount.discountRate}%</span> discount on all items until {timeRemaining}</p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-amber-700">
                                    <span className="font-bold text-amber-900">{activeDiscount.slotQuantity - activeDiscount.slotsUsed}</span> slots left
                                </span>
                                <div className="w-32 h-1 bg-amber-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-amber-500 to-orange-500"
                                        style={{
                                            width: `${((activeDiscount.slotQuantity - activeDiscount.slotsUsed) / activeDiscount.slotQuantity) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-amber-600">{activeDiscount.discountRate}%</p>
                            <p className="text-xs font-semibold text-amber-700 mt-1">OFF</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full h-full flex justify-center pt-8 mx-auto">
                <div className="w-full lg:w-8/10 max-w-7xl flex flex-col lg:grid lg:grid-cols-8 lg:gap-6 px-4">
                    <div className="col-span-8 flex flex-col sm:flex-row justify-between items-center gap-4">
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
                                <SortCombobox onSortChange={setSort} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full col-span-8 row-span-7 grid grid-cols-1 lg:grid-cols-8 gap-6">
                        <div className="mt-6 lg:mt-0 lg:col-span-2 p-6 rounded-lg shadow-sm border border-gray-300 flex flex-col gap-6 h-fit">
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

                        <div className="lg:col-span-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredMenus.length > 0 ? (
                                    filteredMenus.map(item => (
                                        <MenuCard key={item.id} item={item} handleClick={handleOrderClick} />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500">No menus found</p>
                                )}
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
                activeDiscount={activeDiscount}
            />
        </div>
    )
}