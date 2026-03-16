import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsDown, ChevronsUp, Search } from "lucide-react";
import { useState } from "react";

type SortOption = {
    label: string
    value: number
}

const DUMMY_MENU = [
    { id: 1, name: "Classic Burger", price: 12, image: "🍔", category: "Food" },
    { id: 2, name: "Margherita Pizza", price: 15, image: "🍕", category: "Food" },
    { id: 3, name: "French Fries", price: 5, image: "🍟", category: "Snacks" },
    { id: 4, name: "Ice Cream", price: 6, image: "🍦", category: "Dessert" },
    { id: 5, name: "Coffee", price: 4, image: "☕", category: "Drink" },
    { id: 6, name: "Salad", price: 10, image: "🥗", category: "Food" },
    { id: 7, name: "Sushi", price: 18, image: "🍣", category: "Food" },
    { id: 8, name: "Pancakes", price: 8, image: "🥞", category: "Food" },
];

export default function MenuPage() {
    const [order, setOrder] = useState(true)
    const [sort, setSort] = useState(1)
    const [priceFilter, setPriceFilter] = useState(50)
    const [searchQuery, setSearchQuery] = useState("")

    const sortOptions: SortOption[] = [
        { label: "Price", value: 1 },
        { label: "Popularity", value: 2 }
    ]

    return (
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
                                <><ChevronsUp className="w-4 h-4"/> <p>Asc</p></>
                            ) : (
                                <><ChevronsDown className="w-4 h-4"/> <p>Desc</p></>
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
                            {DUMMY_MENU.map(item => (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow bg-white">
                                    <div className="w-full h-32 bg-gray-50 rounded-md flex items-center justify-center text-5xl">
                                        {item.image}
                                    </div>
                                    <div className="flex justify-between items-start mt-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                        <span className="font-bold text-blue-600">${item.price}</span>
                                    </div>
                                    <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors h-10">
                                        Add to Cart
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 p-6 rounded-lg shadow-sm border border-gray-300 flex flex-col gap-6 self-start h-fit">
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <Label className="text-sm font-medium text-gray-700">
                                    Max Price: ${priceFilter}
                                </Label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="50" 
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 font-medium">
                                    <span>$0</span>
                                    <span>$50</span>
                                </div>
                            </div>
                        </div>
                        
                        <Button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-medium transition-colors h-10">
                            Apply Filters
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}