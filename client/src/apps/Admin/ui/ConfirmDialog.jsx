import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

import Button from "./Button";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  icon: Icon = AlertTriangle,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    cancelButtonRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onCancel?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
            p-4
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-[#10131d]
              p-8
              shadow-2xl
            "
          >
            <div className="mb-6 flex justify-center">
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-rose-500/15
                  text-rose-400
                "
              >
                <Icon size={32} />
              </div>
            </div>

            <h2
              id="confirm-dialog-title"
              className="text-center text-2xl font-bold"
            >
              {title}
            </h2>

            <p className="mt-3 text-center text-white/60">
              {message}
            </p>

            <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
              <Button
                ref={cancelButtonRef}
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </Button>

              <Button
                variant="danger"
                loading={loading}
                loadingText={confirmText}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}