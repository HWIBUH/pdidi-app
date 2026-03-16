import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
            console.log(data)
            setMenus(data)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load menus')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Menus with {ingredient?.name}
                </h2>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded">{error}</div>}

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="space-y-3">
                        {menus.map(menu => (
                            <div key={menu.id} className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                                <p className="text-sm text-gray-600">{menu.description}</p>
                                <p className="text-sm font-medium text-blue-600 mt-2">
                                    Rp.{menu.price.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6">
                    <Button
                        onClick={onClose}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}