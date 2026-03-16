import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAllMenus, createMenu, deleteMenu } from '@/service/menu.service'
import { mapIngredientToMenu } from '@/service/admin.service'
import type { Menu } from '@/model/menu.model'
import type { Ingredient } from '@/model/ingredient.model'
import { createIngredient, deleteIngredient, getAllIngredients, toggleIngredientAvailability } from '@/service/ingredients.service'
import MenuForIngredientModal from '@/components/MenuForIngredientModal'
import IngredientsForMenuModal from '@/components/IngredientForMenuModal'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function AdminManage() {
    const [menus, setMenus] = useState<Menu[]>([])
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'menus' | 'ingredients' | 'map'>('menus')

    const [menuName, setMenuName] = useState('')
    const [menuPrice, setMenuPrice] = useState('')
    const [menuDescription, setMenuDescription] = useState('')

    const [ingredientName, setIngredientName] = useState('')

    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)

    const [isMenusModalOpen, setIsMenusModalOpen] = useState(false)
    const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false)
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const [menusRes, ingredientsRes] = await Promise.all([
                getAllMenus(),
                getAllIngredients()
            ])
            setMenus(menusRes)
            setIngredients(ingredientsRes)
            setError(null)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreateMenu = async () => {
        if (!menuName || !menuPrice) {
            setError('Please fill in name and price')
            return
        }

        try {
            await createMenu({
                name: menuName,
                price: Number(menuPrice),
                description: menuDescription,
                image: '',
                available: true
            })
            setMenuName('')
            setMenuPrice('')
            setMenuDescription('')
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create menu')
        }
    }

    const handleDeleteMenu = async (id: number) => {
        try {
            await deleteMenu(id)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete menu')
        }
    }

    const handleCreateIngredient = async () => {
        if (!ingredientName) {
            setError('Please enter ingredient name')
            return
        }

        try {
            await createIngredient({
                name: ingredientName,
                available: true
            })
            setIngredientName('')
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create ingredient')
        }
    }

    const handleToggleIngredient = async (id: number) => {
        try {
            await toggleIngredientAvailability(id)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to toggle ingredient availability')
        }
    }

    const handleDeleteIngredient = async (id: number) => {
        try {
            await deleteIngredient(id)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete ingredient')
        }
    }

    const handleMapIngredient = async () => {
        if (!selectedMenu || !selectedIngredient) {
            setError('Please select menu and ingredient')
            return
        }

        try {
            await mapIngredientToMenu(selectedIngredient, selectedMenu)
            setSelectedMenu(null)
            setSelectedIngredient(null)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to map ingredient')
        }
    }

    if (loading) return <div className="p-6">Loading...</div>

    return (
        <div className="p-6 min-h-screen bg-white">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    onClick={() => navigate("/admin/dashboard")}
                    className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Manage</h1>
            </div>
            {error && <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>}

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('menus')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'menus'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                >
                    Manage Menus
                </button>
                <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'ingredients'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                >
                    Manage Ingredients
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'map'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                >
                    Map Ingredients
                </button>
            </div>

            {activeTab === 'menus' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Menu</h2>
                        <div className="space-y-3">
                            <div>
                                <Label>Menu Name</Label>
                                <Input
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    value={menuPrice}
                                    onChange={(e) => setMenuPrice(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={menuDescription}
                                    onChange={(e) => setMenuDescription(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <Button
                                onClick={handleCreateMenu}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Create Menu
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Menus</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Availability</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menus.map(menu => (
                                        <tr key={menu.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{menu.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">Rp.{menu.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{menu.description}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${menu.available
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {menu.available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Button
                                                    onClick={() => {
                                                        setSelectedMenu(menu)
                                                        setIsIngredientsModalOpen(true)
                                                    }}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                                >
                                                    Show Ingredients
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteMenu(menu.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <IngredientsForMenuModal
                        isOpen={isIngredientsModalOpen}
                        menu={selectedMenu}
                        onClose={() => setIsIngredientsModalOpen(false)}
                    />
                </div>
            )}

            {activeTab === 'ingredients' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Ingredient</h2>
                        <div className="space-y-3">
                            <div>
                                <Label>Ingredient Name</Label>
                                <Input
                                    value={ingredientName}
                                    onChange={(e) => setIngredientName(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <Button
                                onClick={handleCreateIngredient}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Create Ingredient
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients.map(ingredient => (
                                        <tr key={ingredient.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{ingredient.name}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${ingredient.available
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {ingredient.available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        setSelectedIngredient(ingredient)
                                                        setIsMenusModalOpen(true)
                                                    }}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                                >
                                                    Show Menus
                                                </Button>
                                                <Button
                                                    onClick={() => handleToggleIngredient(ingredient.id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                                >
                                                    Toggle Availability
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteIngredient(ingredient.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <MenuForIngredientModal
                        isOpen={isMenusModalOpen}
                        ingredient={selectedIngredient}
                        onClose={() => setIsMenusModalOpen(false)}
                    />
                </div>
            )}

            {activeTab === 'map' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Map Ingredient to Menu</h2>
                    <div className="space-y-4">
                        <div>
                            <Label>Select Menu</Label>
                            <select
                                value={selectedMenu?.id || ''}
                                onChange={(e) => {
                                    const menu = menus.find(m => m.id === Number(e.target.value))
                                    setSelectedMenu(menu || null)
                                }}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Choose a menu...</option>
                                {menus.map(menu => (
                                    <option key={menu.id} value={menu.id}>
                                        {menu.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Select Ingredient</Label>
                            <select
                                value={selectedIngredient?.id || ''}
                                onChange={(e) => {
                                    const ingredient = ingredients.find(i => i.id === Number(e.target.value))
                                    setSelectedIngredient(ingredient || null)
                                }}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Choose an ingredient...</option>
                                {ingredients.map(ingredient => (
                                    <option key={ingredient.id} value={ingredient.id}>
                                        {ingredient.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            onClick={handleMapIngredient}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        >
                            Map Ingredient to Menu
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}