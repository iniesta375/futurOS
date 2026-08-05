import {
  useState,
  useRef,
  useEffect,
  Children,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  ChevronDown,
  Check,
} from "lucide-react";

export default function Select({
  label,
  value,
  onChange,
  children,
  placeholder = "Select...",
  helperText,
  error,
  required = false,
  disabled = false,
  name,
  className = "",
  containerClassName = "",
}) {
  const containerRef = useRef(null);

  const buttonRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [highlighted, setHighlighted] =
    useState(-1);

  const options = Children.toArray(children)
    .filter(
      (child) =>
        child &&
        child.type === "option",
    )
    .map((child) => ({
      value: child.props.value,
      label: child.props.children,
      disabled:
        child.props.disabled || false,
    }));

  const selected =
    options.find(
      (option) =>
        option.value === value,
    ) || null;

  useEffect(() => {
    function outside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      outside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        outside,
      );
  }, []);

  useEffect(() => {
    if (!open) return;

    const index = options.findIndex(
      (option) =>
        option.value === value,
    );

    setHighlighted(index);
  }, [open]);

  function selectOption(option) {
    if (
      option.disabled ||
      disabled
    )
      return;

    onChange?.({
      target: {
        value: option.value,
        name,
      },
    });

    setOpen(false);

    buttonRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (disabled) return;

    switch (e.key) {
      case "Enter":

      case " ":
        e.preventDefault();

        if (!open) {
          setOpen(true);

          return;
        }

        if (
          highlighted >= 0
        ) {
          selectOption(
            options[
              highlighted
            ],
          );
        }

        break;

      case "Escape":
        setOpen(false);

        break;

      case "ArrowDown":
        e.preventDefault();

        if (!open) {
          setOpen(true);

          return;
        }

        setHighlighted(
          (prev) =>
            Math.min(
              prev + 1,
              options.length - 1,
            ),
        );

        break;

      case "ArrowUp":
        e.preventDefault();

        if (!open) {
          setOpen(true);

          return;
        }

        setHighlighted(
          (prev) =>
            Math.max(
              prev - 1,
              0,
            ),
        );

        break;

      default:
        break;
    }
  }

  return (
    <div
      ref={containerRef}
      className={`space-y-2 ${containerClassName}`}
    >
      {label && (
        <label className="text-sm font-medium">
          {label}

          {required && (
            <span className="ml-1 text-rose-400">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
                <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          className={`
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            px-4
            py-3
            text-left
            transition-all
            duration-300
            ${
              error
                ? "border-rose-500/50 bg-rose-500/5"
                : "border-white/10 bg-white/5 hover:border-indigo-500 focus:border-indigo-500"
            }
            ${disabled ? "cursor-not-allowed opacity-50" : ""}
            ${className}
          `}
        >
          <span
            className={
              selected
                ? "text-white"
                : "text-white/45"
            }
          >
            {selected?.label || placeholder}
          </span>

          <motion.div
            animate={{
              rotate: open ? 180 : 0,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.98,
              }}
              transition={{
                duration: 0.18,
              }}
              className="
                absolute
                z-999
                mt-2
                max-h-72
                w-full
                overflow-y-auto
                rounded-2xl
                border
                border-white/10
                bg-[#13151F]
                shadow-2xl
              "
            >
              {options.map(
                (
                  option,
                  index,
                ) => {
                  const active =
                    option.value ===
                    value;

                  const highlightedOption =
                    highlighted ===
                    index;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      disabled={
                        option.disabled
                      }
                      onMouseEnter={() =>
                        setHighlighted(
                          index,
                        )
                      }
                      onClick={() =>
                        selectOption(
                          option,
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-3
                        text-left
                        transition-all

                        ${
                          active
                            ? "bg-indigo-600 text-white"
                            : highlightedOption
                              ? "bg-white/10"
                              : "hover:bg-white/5"
                        }

                        ${
                          option.disabled
                            ? "cursor-not-allowed opacity-40"
                            : ""
                        }
                      `}
                    >
                      <span>
                        {
                          option.label
                        }
                      </span>

                      {active && (
                        <Check
                          size={
                            16
                          }
                        />
                      )}
                    </button>
                  );
                },
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden native select */}
        <select
          hidden
          value={value}
          onChange={onChange}
          name={name}
        >
          {children}
        </select>
      </div>

      {error ? (
        <p className="text-sm text-rose-400">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-white/45">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}