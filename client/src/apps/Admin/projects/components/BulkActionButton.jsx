import { motion } from "framer-motion";

export default function BulkActionButton({
  icon,
  children,
  variant = "primary",
  onClick,
  disabled = false,
}) {
  const variants = {
    primary:
      "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",

    success:
      "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",

    warning:
      "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",

    danger:
      "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",

    gray:
      "bg-white/5 text-white/70 hover:bg-white/10",
  };

  return (
    <motion.button
      whileHover={{
        scale: disabled ? 1 : 1.04,
      }}
      whileTap={{
        scale: disabled ? 1 : 0.97,
      }}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        gap-2
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
      `}
    >
      {icon}

      <span>{children}</span>
    </motion.button>
  );
}