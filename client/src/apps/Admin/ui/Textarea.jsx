import { forwardRef, useId } from "react";

const variants = {
  default:
    "border-white/10 bg-white/5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",

  error:
    "border-rose-500/50 bg-rose-500/5 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
};

const Textarea = forwardRef(function Textarea(
  {
    label,
    helperText,
    error,
    required = false,
    rows = 5,
    className = "",
    containerClassName = "",
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();

  const textareaId = id || generatedId;

  const hasError = Boolean(error);

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium"
        >
          {label}

          {required && (
            <span className="ml-1 text-rose-400">*</span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`
          w-full
          resize-y
          rounded-2xl
          border
          px-4
          py-3
          outline-none
          transition-all
          duration-300
          disabled:cursor-not-allowed
          disabled:opacity-60
          placeholder:text-white/35
          ${hasError ? variants.error : variants.default}
          ${className}
        `}
        {...props}
      />

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

export default Textarea;