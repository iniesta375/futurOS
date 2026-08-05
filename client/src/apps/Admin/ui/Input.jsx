import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const variants = {
  default:
    "border-white/10 bg-white/5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",

  error:
    "border-rose-500/50 bg-rose-500/5 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
};

const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error,
    icon,
    rightIcon,
    loading = false,
    required = false,
    className = "",
    containerClassName = "",
    type = "text",
    id,
    disabled = false,
    ...props
  },
  ref,
) {
  const generatedId = useId();

  const inputId = id || generatedId;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType =
    isPassword && showPassword ? "text" : type;

  const hasError = Boolean(error);

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium"
        >
          {label}

          {required && (
            <span className="ml-1 text-rose-400">*</span>
          )}
        </label>
      )}

      <div
        className={`
          flex
          items-center
          gap-3
          rounded-2xl
          border
          px-4
          py-3
          transition-all
          duration-300
          ${hasError ? variants.error : variants.default}
          ${
            disabled
              ? "cursor-not-allowed opacity-60"
              : ""
          }
          ${className}
        `}
      >
        {icon && (
          <div className="text-white/45">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled || loading}
          className="
            w-full
            bg-transparent
            outline-none
            placeholder:text-white/35
            disabled:cursor-not-allowed
          "
          {...props}
        />

        {loading && (
          <Loader2
            size={18}
            className="animate-spin text-indigo-400"
          />
        )}

        {!loading && rightIcon}

        {!loading && isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="
              text-white/45
              transition
              hover:text-white
            "
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
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
});

export default Input;