interface CategoryCardProps {
  emoji: string;
  label: string;
  backgroundColor: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function CategoryCard({
  emoji,
  label,
  backgroundColor,
  isActive = false,
  onPress,
}: CategoryCardProps) {
  return (
    <button
      className="flex flex-col items-center gap-3 group shrink-0 "
      onClick={onPress}
    >
      <div
        className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
          isActive
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md"
            : "group-hover:scale-105 group-hover:shadow-sm"
        }`}
        style={{ backgroundColor: backgroundColor + "20" }}
      >
        <span className="text-4xl">{emoji}</span>
      </div>
      <span
        className={`text-sm font-medium text-center transition-colors max-w-25 line-clamp-2 ${
          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
