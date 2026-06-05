import { X } from "lucide-react";
import type { Menu } from "@/model/menu.model";
import type { DiscountResponse } from "@/dtos/discount.dto";

interface OrderConfirmationModalProps {
    isOpen: boolean
    selectedMenu: Menu | null
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
    activeDiscount?: DiscountResponse | null
}

export default function OrderConfirmationModal({
    isOpen,
    selectedMenu,
    onConfirm,
    onCancel,
    isLoading = false,
    activeDiscount
}: OrderConfirmationModalProps) {
    if (!isOpen || !selectedMenu) return null
    const originalPrice = selectedMenu?.price || 0
    const discountAmount = activeDiscount
        ? Math.floor(originalPrice * (activeDiscount.discountRate / 100))
        : 0

    const fee = 1000;
    const finalPrice = originalPrice - discountAmount + fee;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold text-ink">Confirm order</h2>
                    <button
                        onClick={onCancel}
                        className="text-muted hover:text-ink transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="pb-3 border-b border-hairline">
                        <h3 className="text-base font-medium text-ink">{selectedMenu.name}</h3>
                        {selectedMenu.description && (
                            <p className="text-sm text-muted mt-1">{selectedMenu.description}</p>
                        )}
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-muted">Original price</span>
                        <span className="text-ink">Rp {originalPrice.toLocaleString()}</span>
                    </div>

                    {activeDiscount && (
                        <div className="flex justify-between text-sm">
                            <span className="text-primary">Discount ({activeDiscount.discountRate}%)</span>
                            <span className="text-primary">-Rp {discountAmount.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm">
                        <span className="text-muted">Service fee</span>
                        <span className="text-ink">Rp {fee.toLocaleString()}</span>
                    </div>

                    <div className="pt-3 border-t border-hairline flex justify-between text-base font-semibold">
                        <span className="text-ink">Total</span>
                        <span className="text-primary">Rp {finalPrice.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-9 rounded-lg border border-hairline text-ink text-sm font-medium transition-colors hover:bg-surface-card"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 h-9 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active disabled:opacity-50"
                    >
                        {isLoading ? "Creating..." : "Confirm order"}
                    </button>
                </div>
            </div>
        </div>
    )
}
