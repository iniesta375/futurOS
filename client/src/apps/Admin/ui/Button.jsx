import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600",

  secondary:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10",

  danger:
    "bg-rose-600 text-white hover:bg-rose-700 border border-rose-600",

  ghost:
    "bg-transparent text-white hover:bg-white/10 border border-transparent",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3",
  lg: "px-6 py-4 text-lg",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    loadingText = "Loading...",
    disabled = false,
    fullWidth = false,
    icon = null,
    className = "",
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        font-medium
        transition-all
        duration-300
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2
            size={18}
            className="animate-spin"
          />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
});

export default Button;