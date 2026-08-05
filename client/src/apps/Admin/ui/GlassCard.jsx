import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
      className={`
        relative
        overflow-visible
        rounded-3xl
        border
        border-white/10
        bg-white/4
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,.35)]
        p-6
        before:absolute
        before:inset-0
        before:pointer-events-none
        before:bg-linear-to-br
        before:from-white/5
        before:via-transparent
        before:to-transparent
        transition-all
        duration-300
        hover:border-indigo-500/30
        hover:shadow-[0_20px_50px_rgba(79,70,229,.18)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}