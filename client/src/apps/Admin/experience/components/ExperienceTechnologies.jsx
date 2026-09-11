export default function ExperienceTechnologies({
  technologies,
  updateField,
  loading,
}) {
  function handleChange(e) {
    const values = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateField("technologies", values);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="font-semibold">
        Technologies
      </h3>

      <p className="mt-1 text-sm text-white/50">
        Separate technologies with commas.
      </p>

      <input
        type="text"
        value={technologies.join(", ")}
        onChange={handleChange}
        disabled={loading}
        placeholder="React, Node.js, MongoDB"
        className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30 focus:border-indigo-500/50"
      />

      {technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-300"
            >
              {technology}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}