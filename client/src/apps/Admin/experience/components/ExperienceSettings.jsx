export default function ExperienceSettings({
  formData,
  updateField,
  loading,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="font-semibold">
        Settings
      </h3>

      <div className="mt-5 space-y-5">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">
              Featured Experience
            </p>

            <p className="mt-1 text-xs text-white/40">
              Highlight this experience on the portfolio.
            </p>
          </div>

          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              updateField(
                "featured",
                e.target.checked
              )
            }
            disabled={loading}
          />
        </label>

        <div>
          <label className="mb-2 block text-sm text-white/70">
            Status
          </label>

          <select
            value={formData.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value
              )
            }
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500/50"
          >
            <option value="Active">
              Active
            </option>

            <option value="Archived">
              Archived
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">
            Display Order
          </label>

          <input
            type="number"
            min="0"
            value={formData.order}
            onChange={(e) =>
              updateField(
                "order",
                Number(e.target.value)
              )
            }
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500/50"
          />

          <p className="mt-1 text-xs text-white/40">
            Lower numbers appear first.
          </p>
        </div>
      </div>
    </div>
  );
}