export default function TableRow({
  children,
  className = "",
  onClick,
  selected = false,
}) {
  const interactive = Boolean(onClick);

  return (
    <tr
      onClick={onClick}
      onKeyDown={(e) => {
        if (
          interactive &&
          (e.key === "Enter" || e.key === " ")
        ) {
          e.preventDefault();
          onClick();
        }
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={`
        border-b
        border-white/10
        transition
        duration-200
        ${
          interactive
            ? "cursor-pointer hover:bg-white/5"
            : ""
        }
        ${
          selected
            ? "bg-indigo-500/10"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </tr>
  );
}