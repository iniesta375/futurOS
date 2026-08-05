import { forwardRef, useId } from "react";
import { Check } from "lucide-react";

const Checkbox = forwardRef(function Checkbox(
  {
    label,
    helperText,
    error,
    id,
    className = "",
    containerClassName = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();

  const checkboxId = id || generatedId;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-start gap-3"
      >
        <div className="relative mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />

          <div
            className={`
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-md
              border
              border-white/15
              bg-white/5
              transition-all
              duration-300
              peer-checked:border-indigo-500
              peer-checked:bg-indigo-600
              peer-focus:ring-2
              peer-focus:ring-indigo-500/20
            `}
          >
            <Check
              size={14}
              className="
                scale-0
                text-white
                transition-transform
                duration-200
                peer-checked:scale-100
              "
            />
          </div>
        </div>

        <div className="flex-1">
          {label && (
            <p className="font-medium">
              {label}
            </p>
          )}

          {(helperText || error) && (
            <p
              className={`mt-1 text-sm ${
                error ? "text-rose-400" : "text-white/45"
              }`}
            >
              {error || helperText}
            </p>
          )}
        </div>
      </label>
    </div>
  );
});

export default Checkbox;