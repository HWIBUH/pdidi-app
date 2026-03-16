import { useState } from "react"

export default function MenuTag({ ingredient }: { ingredient: string }) {
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }

  return (
    <div onClick={handleClick} className={`border rounded-md ${active ? "bg-blue-700" : "bg-white"}`}>
      {ingredient}
    </div>
  )
}