import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
  full: "max-w-7xl",
};

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  size = "lg",
}) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-md
            p-4
            sm:p-6
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative
              flex
              max-h-[92vh]
              w-full
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#0F1118]/95
              shadow-[0_30px_90px_rgba(0,0,0,.55)]
              backdrop-blur-2xl
              ${sizes[size]}
            `}
          >
            {/* Glow */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-3xl
                bg-gradient-to-br
                from-indigo-500/5
                via-transparent
                to-cyan-500/5
              "
            />

            {/* Header */}
            <div
              className="
                sticky
                top-0
                z-20
                flex
                items-start
                justify-between
                gap-6
                border-b
                border-white/10
                bg-[#0F1118]/90
                px-8
                py-6
                backdrop-blur-xl
              "
            >
              <div className="min-w-0 flex-1">
                {typeof title === "string" ? (
                  <h2 className="text-2xl font-bold text-white">
                    {title}
                  </h2>
                ) : (
                  title
                )}
              </div>

              <button
                onClick={onClose}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  text-white/70
                  transition-all
                  duration-300
                  hover:rotate-90
                  hover:border-rose-500/30
                  hover:bg-rose-500/10
                  hover:text-rose-400
                "
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div
              className="
                flex-1
                overflow-y-auto
                px-8
                py-8
              "
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className="
                  sticky
                  bottom-0
                  border-t
                  border-white/10
                  bg-[#0F1118]/90
                  px-8
                  py-5
                  backdrop-blur-xl
                "
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}