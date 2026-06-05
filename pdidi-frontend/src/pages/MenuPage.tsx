import { ChevronRight, ChevronsUp, ChevronsDown, Search } from "lucide-react";
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
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <p className="text-muted">Loading menus...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <p className="text-error">Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-ink">Menu</h1>
                <button
                    onClick={() => navigate("/orders")}
                    className="h-9 px-4 rounded-lg bg-surface-dark text-on-dark text-sm font-medium transition-colors hover:bg-surface-dark-elevated inline-flex items-center gap-1.5"
                >
                    My orders <ChevronRight className="size-4" />
                </button>
            </div>

            {activeDiscount && (
                <div className="rounded-xl bg-surface-card p-5 mb-8 border-l-4 border-primary">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-ink">Discount active</p>
                            <p className="text-sm text-muted mt-0.5">
                                <strong className="text-primary">{activeDiscount.discountRate}%</strong> off all items • {timeRemaining}
                            </p>
                            <p className="text-xs text-muted-soft mt-1">
                                {activeDiscount.slotQuantity - activeDiscount.slotsUsed} slots remaining
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-3xl font-bold text-primary">{activeDiscount.discountRate}%</p>
                            <p className="text-xs text-muted font-medium">OFF</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
                <div className="rounded-xl bg-surface-card p-5 h-fit space-y-5">
                    <h2 className="text-sm font-semibold text-ink">Filters</h2>
                    <div>
                        <label className="text-xs text-muted font-medium block mb-2">
                            Max price: Rp {priceFilter.toLocaleString()}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(Number(e.target.value))}
                            className="w-full h-1.5 bg-hairline rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-soft mt-1">
                            <span>0</span>
                            <span>Rp {maxPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                            <input
                                placeholder="Search menu..."
                                className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-card text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="h-9 px-3 rounded-lg bg-surface-card text-muted text-sm font-medium transition-colors hover:bg-surface-card inline-flex items-center gap-1.5"
                                onClick={() => setOrder(!order)}
                            >
                                {order ? (
                                    <><ChevronsUp className="size-4" /> Asc</>
                                ) : (
                                    <><ChevronsDown className="size-4" /> Desc</>
                                )}
                            </button>

                            <div className="w-36">
                                <SortCombobox onSortChange={setSort} />
                            </div>
                        </div>
                    </div>

                    {filteredMenus.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMenus.map(item => (
                                <MenuCard key={item.id} item={item} handleClick={handleOrderClick} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted py-12">No menus found</p>
                    )}
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
