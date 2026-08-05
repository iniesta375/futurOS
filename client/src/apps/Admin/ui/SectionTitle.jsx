export default function SectionTitle({
  title,
  subtitle,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        mb-6
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
        ${className}
      `}
    >
      <div>
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-white/50">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}