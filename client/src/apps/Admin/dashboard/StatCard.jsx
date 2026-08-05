import GlassCard from "../ui/GlassCard";

export default function StatCard({
  icon,
  title,
  value,
  subtitle = "",
  iconColor = "text-indigo-400",
}) {
  return (
    <GlassCard className="min-h-42.5">
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              {title}
            </p>

            <h2 className="mt-5 text-5xl font-bold">
              {value}
            </h2>
          </div>

          <div
            className={`
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-white/5
              ${iconColor}
            `}
          >
            {icon}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-sm text-white/45">
            {subtitle}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
