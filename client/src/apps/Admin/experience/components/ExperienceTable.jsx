import {
  Pencil,
  Trash2,
  Star,
  Archive,
} from "lucide-react";

import GlassCard from "../../ui/GlassCard";
import EmptyState from "../../ui/EmptyState";

function formatDate(date) {
  if (!date) return "Present";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function ExperienceTable({
  experiences,
  loading,
  onEdit,
  onDelete,
  onArchive,
  selectedExperiences,
  toggleExperienceSelection,
  toggleSelectAll,
}) {
  if (loading) {
    return (
      <GlassCard>
        <div className="py-20 text-center">
          Loading experience...
        </div>
      </GlassCard>
    );
  }

  if (!experiences.length) {
    return (
      <GlassCard>
        <EmptyState
          title="No experience found"
          description="Create your first experience."
        />
      </GlassCard>
    );
  }

  const allSelected =
    experiences.length > 0 &&
    selectedExperiences.length === experiences.length;

  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-white/10">
            <tr className="text-left text-sm text-white/60">
              <th className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="px-4 py-4">
                Company
              </th>

              <th className="px-4 py-4">
                Role
              </th>

              <th className="px-4 py-4">
                Type
              </th>

              <th className="px-4 py-4">
                Duration
              </th>

              <th className="px-4 py-4">
                Status
              </th>

              <th className="px-4 py-4">
                Featured
              </th>

              <th className="px-4 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {experiences.map((experience) => (
              <tr
                key={experience._id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="px-4 py-5">
                  <input
                    type="checkbox"
                    checked={selectedExperiences.includes(
                      experience._id
                    )}
                    onChange={() =>
                      toggleExperienceSelection(
                        experience._id
                      )
                    }
                  />
                </td>

                <td className="px-4 py-5">
                  <div>
                    <p className="font-medium">
                      {experience.company}
                    </p>

                    {experience.location && (
                      <p className="mt-1 text-xs text-white/40">
                        {experience.location}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 py-5">
                  <p className="font-medium">
                    {experience.role}
                  </p>
                </td>

                <td className="px-4 py-5">
                  <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-300">
                    {experience.employmentType}
                  </span>
                </td>

                <td className="px-4 py-5">
                  <div className="text-sm">
                    <p>
                      {formatDate(experience.startDate)}
                      {" — "}
                      {experience.current
                        ? "Present"
                        : formatDate(experience.endDate)}
                    </p>

                    {experience.current && (
                      <span className="mt-1 inline-block text-xs text-emerald-400">
                        Current
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      experience.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {experience.status}
                  </span>
                </td>

                <td className="px-4 py-5">
                  {experience.featured ? (
                    <Star
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(experience)
                      }
                      className="rounded-xl p-2 transition hover:bg-indigo-500/10"
                    >
                      <Pencil size={18} />
                    </button>

                    {experience.status === "Active" && (
                      <button
                        type="button"
                        onClick={() =>
                          onArchive(experience)
                        }
                        className="rounded-xl p-2 transition hover:bg-yellow-500/10"
                      >
                        <Archive size={18} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(experience)
                      }
                      className="rounded-xl p-2 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}