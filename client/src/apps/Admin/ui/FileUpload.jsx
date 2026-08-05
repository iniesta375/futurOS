import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, ImageIcon, X } from "lucide-react";

export default function FileUpload({
  value = "",
  onChange,
  onRemove,
  loading = false,
  label = "Upload Image",
  accept = "image/*",
  maxSize = 5,
}) {
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file || loading) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      return;
    }

    onChange?.(file);
  }

  function handleDrop(e) {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    handleFile(file);
  }

  function handleBrowse(e) {
    handleFile(e.target.files[0]);
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        {label}
      </label>

      <motion.div
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.99 }}
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`
          flex
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-2xl
          border-2
          border-dashed
          p-8
          transition-all
          duration-300
          ${
            loading
              ? "pointer-events-none opacity-60"
              : "border-white/10 bg-white/5 hover:border-indigo-500 hover:bg-indigo-500/5"
          }
        `}
      >
        <input
          ref={inputRef}
          hidden
          type="file"
          accept={accept}
          onChange={handleBrowse}
        />

        <UploadCloud
          size={42}
          className="mb-4 text-white/60"
        />

        <p className="font-medium">
          Click or drag an image here
        </p>

        <p className="mt-2 text-sm text-white/50">
          PNG • JPG • JPEG • WEBP
        </p>

        <p className="mt-1 text-xs text-white/40">
          Maximum {maxSize} MB
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <img
              src={value}
              alt="Preview"
              className="h-64 w-full object-cover"
            />

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} />

                <span className="text-sm">
                  Image Preview
                </span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={onRemove}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-rose-500/10
                  px-4
                  py-2
                  text-rose-400
                  transition
                  hover:bg-rose-500/20
                "
              >
                <X size={16} />

                Remove
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              py-12
              text-center
            "
          >
            <ImageIcon
              size={42}
              className="mx-auto text-white/25"
            />

            <p className="mt-4 text-white/55">
              No image selected
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}