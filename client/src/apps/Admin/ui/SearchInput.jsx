import { Loader2, Search, X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  loading = false,
  onClear,
  ariaLabel = "Search",
  autoFocus = false,
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/10
        bg-white/5
        px-4
        py-3
        transition
        duration-200
        focus-within:border-indigo-500
        focus-within:ring-2
        focus-within:ring-indigo-500/20
        ${className}
      `}
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin text-indigo-400"
        />
      ) : (
        <Search
          size={18}
          className="text-white/40 transition-colors"
        />
      )}

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        autoFocus={autoFocus}
        onKeyDown={(e) => {
          if (e.key === "Escape" && onClear) {
            onClear();
          }
        }}
        className="
          w-full
          bg-transparent
          outline-none
          placeholder:text-white/35
        "
      />

      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="
            rounded-full
            p-1
            text-white/40
            transition
            hover:bg-white/10
            hover:text-white
          "
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
