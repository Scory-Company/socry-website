"use client"

interface CategoryFilterChipsProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategoryFilterChips({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterChipsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide mb-6">
      <div className="flex gap-2 px-0 py-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap shadow-sm ${
              selectedCategory === category
                ? "bg-primary border-primary text-primary-foreground font-semibold"
                : "bg-card border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
