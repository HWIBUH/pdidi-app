import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getIngredientsForMenu } from '@/service/menu.service'
import type { Ingredient } from '@/model/ingredient.model'
import type { Menu } from '@/model/menu.model'

interface IngredientsForMenuModalProps {
    isOpen: boolean
    menu: Menu | null
    onClose: () => void
}

export default function IngredientsForMenuModal({ isOpen, menu, onClose }: IngredientsForMenuModalProps) {
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && menu) {
            fetchIngredients()
        }
    }, [isOpen, menu])

    const fetchIngredients = async () => {
        if (!menu) return
        setIngredients([])
        setLoading(true)
        setError(null)
        try {
            const data = await getIngredientsForMenu(menu)
            console.log(data)
            setIngredients(data)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load Menus')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Ingredients for {menu?.name}
                </h2>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded">{error}</div>}

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="space-y-3">
                        {ingredients.map(ingredient => (
                            <div key={ingredient.id} className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-semibold text-gray-900">{ingredient.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ingredient.available
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {ingredient.available ? 'Available' : 'Unavailable'}
                                </span>
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