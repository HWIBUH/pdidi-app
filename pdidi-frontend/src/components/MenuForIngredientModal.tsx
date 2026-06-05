import { useState, useEffect } from 'react'
import { getMenuForIngredient } from '@/service/ingredients.service'
import type { Menu } from '@/model/menu.model'
import type { Ingredient } from '@/model/ingredient.model'

interface MenuForIngredientModalProps {
    isOpen: boolean
    ingredient: Ingredient | null
    onClose: () => void
}

export default function MenuForIngredientModal({ isOpen, ingredient, onClose }: MenuForIngredientModalProps) {
    const [menus, setMenus] = useState<Menu[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && ingredient) {
            fetchMenus()
        }
    }, [isOpen, ingredient])

    const fetchMenus = async () => {
        if (!ingredient) return
        setMenus([])
        setLoading(true)
        setError(null)
        try {
            const data = await getMenuForIngredient(ingredient)
            setMenus(data)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load menus')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-96 overflow-y-auto shadow-lg">
                <h2 className="text-sm font-semibold text-ink mb-4">
                    Menus with <span className="text-accent-teal">{ingredient?.name}</span>
                </h2>

                {error && <p className="mb-3 text-sm text-error">{error}</p>}

                {loading ? (
                    <p className="text-sm text-muted">Loading...</p>
                ) : (
                    <div className="space-y-2">
                        {menus.map(menu => (
                            <div key={menu.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-card">
                                <div>
                                    <p className="text-sm text-ink">{menu.name}</p>
                                    {menu.description && (
                                        <p className="text-xs text-muted mt-0.5">{menu.description}</p>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-primary shrink-0 ml-4">Rp {menu.price.toLocaleString()}</p>
                            </div>
                        ))}
                        {menus.length === 0 && !loading && (
                            <p className="text-sm text-muted">No menus found</p>
                        )}
                    </div>
                )}

                <div className="mt-5">
                    <button
                        onClick={onClose}
                        className="w-full h-9 rounded-lg border border-hairline text-ink text-sm font-medium transition-colors hover:bg-surface-card"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
