import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

import Button from "./Button";

const colors = {
  indigo: "bg-indigo-500/10 text-indigo-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  amber: "bg-amber-500/10 text-amber-400",
  rose: "bg-rose-500/10 text-rose-400",
  sky: "bg-sky-500/10 text-sky-400",
};

export default function EmptyState({
  icon,
  title = "Nothing Here",
  subtitle = "There is no data to display.",
  buttonText,
  onAction,
  color = "indigo",
  children,
}) {
   const Icon = icon ?? <FolderOpen size={60} />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="
        mx-auto
        flex
        max-w-lg
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-white/10
        bg-white/5
        px-8
        py-16
        text-center
      "
    >
      <div>
        {Icon}
      </div>

      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-white/55">
        {subtitle}
      </p>

      {buttonText && (
        <Button
          className="mt-8"
          onClick={onAction}
        >
          {buttonText}
        </Button>
      )}

      {children}
    </motion.div>
  );
}
