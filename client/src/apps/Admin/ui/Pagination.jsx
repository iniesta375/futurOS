import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  function getPages() {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );
    }

    const pages = [1];

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  }

  return (
    <div
      className={`
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
        ${className}
      `}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-4
          py-2
          transition
          hover:bg-white/10
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {getPages().map((item, index) =>
          item === "..." ? (
            <span
              key={index}
              className="px-2 text-white/40"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`
                h-10
                w-10
                rounded-xl
                transition
                ${
                  item === page
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 hover:bg-white/10"
                }
              `}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-4
          py-2
          transition
          hover:bg-white/10
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}