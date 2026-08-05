const animation = {
  normal: "animate-pulse",
  slow: "animate-pulse [animation-duration:2s]",
};

export default function LoadingSkeleton({
  rows = 3,
  className = "",
  variant = "text",
  speed = "normal",
}) {
  if (variant === "card") {
    return (
      <div
        className={`
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-6
          ${animation[speed]}
          ${className}
        `}
      >
        <div className="mb-6 h-10 w-10 rounded-full bg-white/10" />

        <div className="mb-4 h-6 w-1/2 rounded bg-white/10" />

        <div className="space-y-3">
          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-white/10" />
          <div className="h-4 w-2/3 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={`
          space-y-4
          ${animation[speed]}
          ${className}
        `}
      >
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-14 rounded-2xl bg-white/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`
        space-y-3
        ${animation[speed]}
        ${className}
      `}
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`
            h-4
            rounded-xl
            bg-white/10
            ${
              index % 3 === 0
                ? "w-full"
                : index % 3 === 1
                ? "w-5/6"
                : "w-2/3"
            }
          `}
        />
      ))}
    </div>
  );
}