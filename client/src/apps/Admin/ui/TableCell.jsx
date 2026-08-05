const alignments = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function TableCell({
  children,
  header = false,
  className = "",
  align = "left",
  compact = false,
  noWrap = false,
  ...props
}) {
  const Component = header ? "th" : "td";

  return (
    <Component
      {...props}
      className={`
        ${compact ? "px-4 py-2" : "px-6 py-4"}
        ${alignments[align]}
        align-middle
        ${
          header
            ? "font-semibold text-white"
            : "text-white/70"
        }
        ${noWrap ? "whitespace-nowrap" : ""}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}