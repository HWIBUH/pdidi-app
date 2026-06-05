import { useState, useEffect } from 'react'
import { getAllMenus, createMenu, deleteMenu } from '@/service/menu.service'
import { mapIngredientToMenu } from '@/service/admin.service'
import type { Menu } from '@/model/menu.model'
import type { Ingredient } from '@/model/ingredient.model'
import { createIngredient, deleteIngredient, getAllIngredients, toggleIngredientAvailability } from '@/service/ingredients.service'
import MenuForIngredientModal from '@/components/MenuForIngredientModal'
import IngredientsForMenuModal from '@/components/IngredientForMenuModal'
import { useNavigate } from 'react-router'
import { ChevronLeft, Utensils, Plus, X } from 'lucide-react'
import { updateMenu } from '@/service/menu.service'
import { compressImage } from '@/utils/compress-image'

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
    const [uploadingMenuId, setUploadingMenuId] = useState<number | null>(null)
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

    const handleImageUpload = async (menuId: number, file: File) => {
        setUploadingMenuId(menuId)
        try {
            const compressedBase64 = await compressImage(file)
            await updateMenu(menuId, { image: compressedBase64 })
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to upload image")
        } finally {
            setUploadingMenuId(null)
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

    if (loading) return <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-muted">Loading...</p></div>

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-canvas">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="h-9 px-3 rounded-lg bg-surface-card text-ink text-sm font-medium transition-colors hover:bg-surface-card inline-flex items-center gap-1.5"
                    >
                        <ChevronLeft className="size-4" /> Dashboard
                    </button>
                    <h1 className="text-xl font-semibold tracking-tight text-ink">Manage</h1>
                </div>

                {error && <p className="text-error text-sm mb-4">{error}</p>}

                <div className="flex gap-2 mb-6">
                    {(['menus', 'ingredients', 'map'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-card text-ink hover:bg-surface-card'
                            }`}
                        >
                            {tab === 'menus' ? 'Menus' : tab === 'ingredients' ? 'Ingredients' : 'Map'}
                        </button>
                    ))}
                </div>

                {activeTab === 'menus' && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-surface-card p-5">
                            <h2 className="text-sm font-semibold text-ink mb-4">Create menu</h2>
                            <div className="space-y-3">
                                <input
                                    placeholder="Menu name"
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={menuPrice}
                                    onChange={(e) => setMenuPrice(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
                                />
                                <input
                                    placeholder="Description"
                                    value={menuDescription}
                                    onChange={(e) => setMenuDescription(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    onClick={handleCreateMenu}
                                    className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active inline-flex items-center gap-1.5"
                                >
                                    <Plus className="size-4" /> Create menu
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl bg-surface-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-hairline">
                                <h2 className="text-sm font-semibold text-ink">Menus</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-hairline">
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Image</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Name</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Price</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Description</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Avail.</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menus.map(menu => (
                                            <tr key={menu.id} className="border-b border-hairline hover:bg-canvas/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="size-10 rounded-md bg-surface-dark-soft flex items-center justify-center overflow-hidden">
                                                        {menu.image ? (
                                                            <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Utensils className="size-4 text-muted-soft" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-ink font-medium">{menu.name}</td>
                                                <td className="px-5 py-3.5 text-ink">Rp {menu.price.toLocaleString()}</td>
                                                <td className="px-5 py-3.5 text-muted text-xs max-w-40 truncate">{menu.description}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-medium ${menu.available ? 'text-success' : 'text-muted'}`}>
                                                        {menu.available ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        <button
                                                            onClick={() => { setSelectedMenu(menu); setIsIngredientsModalOpen(true) }}
                                                            className="h-7 px-2.5 rounded-md bg-accent-teal text-white text-xs font-medium transition-colors hover:opacity-90"
                                                        >
                                                            Ingredients
                                                        </button>
                                                        <label className="h-7 px-2.5 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-surface-card cursor-pointer inline-flex items-center">
                                                            Image
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(menu.id, e.target.files[0]) }}
                                                                disabled={uploadingMenuId === menu.id}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                        <button
                                                            onClick={() => handleDeleteMenu(menu.id)}
                                                            className="h-7 px-2.5 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-error hover:text-white hover:border-error"
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                    </div>
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
                        <div className="rounded-xl bg-surface-card p-5">
                            <h2 className="text-sm font-semibold text-ink mb-4">Create ingredient</h2>
                            <div className="space-y-3">
                                <input
                                    placeholder="Ingredient name"
                                    value={ingredientName}
                                    onChange={(e) => setIngredientName(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    onClick={handleCreateIngredient}
                                    className="h-9 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active inline-flex items-center gap-1.5"
                                >
                                    <Plus className="size-4" /> Create ingredient
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl bg-surface-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-hairline">
                                <h2 className="text-sm font-semibold text-ink">Ingredients</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-hairline">
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Name</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Status</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ingredients.map(ingredient => (
                                            <tr key={ingredient.id} className="border-b border-hairline hover:bg-canvas/50 transition-colors">
                                                <td className="px-5 py-3.5 text-ink font-medium">{ingredient.name}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs font-medium ${ingredient.available ? 'text-success' : 'text-muted'}`}>
                                                        {ingredient.available ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => { setSelectedIngredient(ingredient); setIsMenusModalOpen(true) }}
                                                            className="h-7 px-2.5 rounded-md bg-accent-teal text-white text-xs font-medium transition-colors hover:opacity-90"
                                                        >
                                                            Menus
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleIngredient(ingredient.id)}
                                                            className="h-7 px-2.5 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-surface-card"
                                                        >
                                                            Toggle
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteIngredient(ingredient.id)}
                                                            className="h-7 px-2.5 rounded-md bg-white border border-hairline text-muted text-xs font-medium transition-colors hover:bg-error hover:text-white hover:border-error"
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                    </div>
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
                    <div className="rounded-xl bg-surface-card p-5 max-w-lg">
                        <h2 className="text-sm font-semibold text-ink mb-4">Map ingredient to menu</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-muted font-medium block mb-1.5">Menu</label>
                                <select
                                    value={selectedMenu?.id || ''}
                                    onChange={(e) => {
                                        const menu = menus.find(m => m.id === Number(e.target.value))
                                        setSelectedMenu(menu || null)
                                    }}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="">Choose a menu...</option>
                                    {menus.map(menu => (
                                        <option key={menu.id} value={menu.id}>{menu.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-muted font-medium block mb-1.5">Ingredient</label>
                                <select
                                    value={selectedIngredient?.id || ''}
                                    onChange={(e) => {
                                        const ingredient = ingredients.find(i => i.id === Number(e.target.value))
                                        setSelectedIngredient(ingredient || null)
                                    }}
                                    className="w-full h-9 px-3 rounded-lg bg-white border border-hairline text-ink text-sm focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="">Choose an ingredient...</option>
                                    {ingredients.map(ingredient => (
                                        <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleMapIngredient}
                                className="w-full h-9 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active"
                            >
                                Map ingredient to menu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
