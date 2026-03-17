import { Button } from "@/components/ui/button";
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
    const finalPrice = originalPrice - discountAmount

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Confirm Order</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{selectedMenu.name}</h3>
                        {selectedMenu.description && (
                            <p className="text-sm text-gray-500 mt-2">{selectedMenu.description}</p>
                        )}
                    </div>

                    <div className="flex justify-between text-gray-700">
                        <span>Original Price:</span>
                        <span>Rp {originalPrice.toLocaleString()}</span>
                    </div>
                    {activeDiscount && (
                        <>
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Discount ({activeDiscount.discountRate}%):</span>
                                <span>-Rp {discountAmount.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                <span>Total:</span>
                                <span>Rp {finalPrice.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                You save Rp {discountAmount.toLocaleString()}!
                            </p>
                        </>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={onCancel}
                        variant="outline"
                        className="flex-1 h-10"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? "Creating..." : "Confirm Order"}
                    </Button>
                </div>
            </div>
        </div>
    )
}