export default function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  className = "",
}) {
  return (
    <header
      className={`
        mb-8
        flex
        flex-col
        gap-6
        lg:flex-row
        lg:items-end
        lg:justify-between
        ${className}
      `}
    >
      <div>
        {breadcrumb && (
          <p className="mb-2 text-sm text-white/40">
            {breadcrumb}
          </p>
        )}

        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-white/60">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}