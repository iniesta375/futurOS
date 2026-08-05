export default function Table({
  children,
  className = "",
  compact = false,
}) {
  return (
    <div
      className={`
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        shadow-xl
        transition
        duration-200
        ${className}
      `}
    >
      <div className="overflow-x-auto">
        <table
          className={`
            min-w-full
            ${compact ? "text-sm" : ""}
          `}
        >
          {children}
        </table>
      </div>
    </div>
  );
}