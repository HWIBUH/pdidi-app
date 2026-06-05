import type { Menu } from "@/model/menu.model";
import { Utensils } from "lucide-react";

interface MenuCard {
    item: Menu
    handleClick: (item: Menu) => void
}

export default function MenuCard({item, handleClick} : MenuCard) {
    return (
        <div className={`rounded-xl bg-surface-card overflow-hidden flex flex-col ${!item.available ? 'opacity-50' : ''}`}>
            <div className="w-full h-36 bg-surface-dark-soft flex items-center justify-center overflow-hidden">
                {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover" />
                ) : (
                    <Utensils className="size-10 text-on-dark-soft" />
                )}
            </div>

            <div className="flex flex-col flex-1 p-4 gap-3">
                <div>
                    <h3 className="font-semibold text-ink text-base leading-snug line-clamp-2">{item.name}</h3>
                    {item.description && (
                        <p className="text-xs text-muted line-clamp-2 mt-1">{item.description}</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-semibold text-primary">Rp {item.price.toLocaleString()}</span>
                    {!item.available && (
                        <span className="text-xs text-muted">Unavailable</span>
                    )}
                </div>

                <button
                    className={`w-full h-9 rounded-lg text-sm font-medium transition-colors ${item.available
                        ? 'bg-primary text-on-primary hover:bg-primary-active'
                        : 'bg-surface-dark-soft text-on-dark-soft cursor-not-allowed'
                    }`}
                    onClick={() => handleClick(item)}
                    disabled={!item.available}
                >
                    {item.available ? "Order" : "Unavailable"}
                </button>
            </div>
        </div>
    )
}
