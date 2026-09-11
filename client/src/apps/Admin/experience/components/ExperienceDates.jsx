export default function ExperienceDates({
  formData,
  updateField,
  loading,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="font-semibold">
        Employment Period
      </h3>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Start Date
          </label>

          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              updateField(
                "startDate",
                e.target.value
              )
            }
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">
            End Date
          </label>

          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              updateField(
                "endDate",
                e.target.value
              )
            }
            disabled={loading || formData.current}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-40 focus:border-indigo-500/50"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={formData.current}
            onChange={(e) =>
              updateField(
                "current",
                e.target.checked
              )
            }
            disabled={loading}
          />

          <span className="text-sm text-white/70">
            I currently work here
          </span>
        </label>
      </div>
    </div>
  );
}