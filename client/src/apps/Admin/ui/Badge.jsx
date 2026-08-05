const variants = {
  primary:
    "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20",

  success:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",

  warning:
    "bg-amber-500/15 text-amber-400 border border-amber-500/20",

  danger:
    "bg-rose-500/15 text-rose-400 border border-rose-500/20",

  info:
    "bg-sky-500/15 text-sky-400 border border-sky-500/20",

  gray:
    "bg-white/5 text-white/70 border border-white/10",
};

const sizes = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

export default function Badge({
  children,
  icon = null,
  variant = "primary",
  size = "md",
  clickable = false,
  className = "",
  ...props
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        font-semibold
        transition
        duration-200
        ${sizes[size]}
        ${variants[variant]}
        ${clickable ? "cursor-pointer hover:scale-105" : ""}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <span className="shrink-0">
          {icon}
        </span>
      )}

      {children}
    </span>
  );
}