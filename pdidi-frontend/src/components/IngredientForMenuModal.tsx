import { useState, useEffect, useCallback } from "react";
import { getIngredientsForMenu } from "@/service/menu.service";
import type { Ingredient } from "@/model/ingredient.model";
import type { Menu } from "@/model/menu.model";
import { AxiosError } from "axios";

interface IngredientsForMenuModalProps {
  isOpen: boolean;
  menu: Menu | null;
  onClose: () => void;
}

export default function IngredientsForMenuModal({
  isOpen,
  menu,
  onClose,
}: IngredientsForMenuModalProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = useCallback(async () => {
    if (!menu) return;
    setIngredients([]);
    setLoading(true);
    setError(null);
    try {
      const data = await getIngredientsForMenu(menu);
      setIngredients(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Failed to load ingredients");
      } else {
        setError("Failed to load ingredients");
      }
    } finally {
      setLoading(false);
    }
  }, [menu]);

  useEffect(() => {
    if (isOpen && menu) {
      fetchIngredients();
    }
  }, [isOpen, menu, fetchIngredients]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-96 overflow-y-auto shadow-lg">
        <h2 className="text-sm font-semibold text-ink mb-4">
          Ingredients for <span className="text-primary">{menu?.name}</span>
        </h2>

        {error && (
          <p className="mb-3 text-sm text-error">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-card">
                <span className="text-sm text-ink">{ingredient.name}</span>
                <span className={`text-xs font-medium ${ingredient.available ? 'text-success' : 'text-muted'}`}>
                  {ingredient.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            ))}
            {ingredients.length === 0 && !loading && (
              <p className="text-sm text-muted">No ingredients found</p>
            )}
          </div>
        )}

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full h-9 rounded-lg border border-hairline text-ink text-sm font-medium transition-colors hover:bg-surface-card"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
