import type { Menu } from "@/model/menu.model";
import { Utensils } from "lucide-react";
import { Button } from "./ui/button";

interface MenuCard {
    item: Menu
    handleClick: (item: Menu) => void
}

export default function MenuCard({item, handleClick} : MenuCard) {
    return (
        <div
        className={`border rounded-lg overflow-hidden flex flex-col gap-0 hover:shadow-lg transition-shadow bg-white ${!item.available ? 'opacity-60 border-gray-300' : 'border-gray-200 hover:shadow-lg'
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
                    onClick={() => handleClick(item)}
                    disabled={!item.available}
                >
                    {item.available ? "Order" : "Unavailable"}
                </Button>
            </div>
        </div>
    )
}