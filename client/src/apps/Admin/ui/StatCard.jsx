import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "indigo",
  trend,
  trendLabel,
}) {
  const colors = {
    indigo: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      ring: "ring-indigo-500/20",
    },

    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      ring: "ring-emerald-500/20",
    },

    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      ring: "ring-amber-500/20",
    },

    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      ring: "ring-rose-500/20",
    },

    sky: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      ring: "ring-sky-500/20",
    },
  };

  const theme = colors[color] || colors.indigo;

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-md
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            ring-1
            ${theme.bg}
            ${theme.text}
            ${theme.ring}
          `}
        >
          {Icon && <Icon size={28} />}
        </div>
      </div>

      {(trend || trendLabel) && (
        <div className="mt-6 flex items-center gap-2 text-sm">
          {trend > 0 ? (
            <TrendingUp
              size={16}
              className="text-emerald-400"
            />
          ) : trend < 0 ? (
            <TrendingDown
              size={16}
              className="text-rose-400"
            />
          ) : null}

          {trend !== undefined && (
            <span
              className={
                trend > 0
                  ? "text-emerald-400"
                  : trend < 0
                    ? "text-rose-400"
                    : "text-white/50"
              }
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}

          {trendLabel && (
            <span className="text-white/45">
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}