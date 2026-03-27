import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";

type SortOption = {
    label: string
    value: number
}

interface SortComboboxProps {
    onSortChange: (value: number) => void
}

export default function SortCombobox({ onSortChange }: SortComboboxProps) {
    const sortOptions: SortOption[] = [
        { label: "Price", value: 1 },
        { label: "Name", value: 2 }
    ]

    return (
        <Combobox
            items={sortOptions}
            itemToStringValue={(sortOption: SortOption) => sortOption.label}
            onValueChange={(e) => onSortChange(e?.value || 1)}
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
                            value={item}
                        >
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}