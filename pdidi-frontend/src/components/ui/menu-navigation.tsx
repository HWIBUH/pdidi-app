import { Input } from "./input"

interface MenuNavProps {
  search: string
  onSearchChange: (value: string) => void

  order: "asc" | "desc"
  onToggleOrder: () => void

  sortOption: string
  onSortChange: (value: string) => void
}

export default function MenuNav({
  search,
  onSearchChange,
  order,
  onToggleOrder,
  sortOption,
  onSortChange
}: MenuNavProps) {

  return (
    <>
      <div>
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div>
        <button onClick={onToggleOrder}>
          {order === "asc" ? "Ascending" : "Descending"}
        </button>

        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </>
  )
}