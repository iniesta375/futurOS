import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white",

  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white",

  danger:
    "bg-rose-600 hover:bg-rose-700 text-white",

  warning:
    "bg-amber-500 hover:bg-amber-600 text-black",

  ghost:
    "bg-white/5 hover:bg-white/10 text-white border border-white/10",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3",
  lg: "px-5 py-3 text-lg",
};

export default function IconButton({
  icon,
  text,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  ariaLabel,
  className = "",
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel || text}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-medium
        cursor-pointer
        transition
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500/50
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : (
        icon
      )}

      {text && <span>{text}</span>}
    </motion.button>
  );
}