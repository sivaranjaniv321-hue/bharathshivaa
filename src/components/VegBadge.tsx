interface VegBadgeProps {
  isVeg: boolean;
  showLabel?: boolean;
}

export function VegBadge({ isVeg, showLabel = false }: VegBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 shrink-0"
      aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span
        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 ${
          isVeg ? 'border-emerald-700 bg-white' : 'border-red-700 bg-white'
        }`}
      >
        {isVeg ? (
          <span className="w-2 h-2 rounded-full bg-emerald-700" />
        ) : (
          <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-red-700" />
        )}
      </span>
      {showLabel && (
        <span
          className={`text-xs font-medium whitespace-nowrap ${
            isVeg ? 'text-emerald-800' : 'text-red-800'
          }`}
        >
          {isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        </span>
      )}
    </span>
  );
}
