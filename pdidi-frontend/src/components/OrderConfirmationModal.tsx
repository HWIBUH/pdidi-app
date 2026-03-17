import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Menu } from "@/model/menu.model";

interface OrderConfirmationModalProps {
    isOpen: boolean
    selectedMenu: Menu | null
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

export default function OrderConfirmationModal({
    isOpen,
    selectedMenu,
    onConfirm,
    onCancel,
    isLoading = false
}: OrderConfirmationModalProps) {
    if (!isOpen || !selectedMenu) return null

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

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Price:</span>
                        <span className="text-2xl font-bold text-blue-600">
                            Rp {selectedMenu.price.toLocaleString()}
                        </span>
                    </div>
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