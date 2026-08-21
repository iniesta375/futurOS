import { Pencil, Trash2, Star } from "lucide-react";

import GlassCard from "../../ui/GlassCard";
import EmptyState from "../../ui/EmptyState";

export default function SkillTable({
  skills,
  loading,
  onEdit,
  onDelete,
  selectedSkills,
  toggleSkillSelection,
  toggleSelectAll,
}) {
  if (loading) {
    return (
      <GlassCard>
        <div className="py-20 text-center">Loading skills...</div>
      </GlassCard>
    );
  }

  if (!skills.length) {
    return (
      <GlassCard>
        <EmptyState
          title="No skills found"
          description="Create your first skill."
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr className="text-left text-sm text-white/60">
              <th className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={
                    skills.length > 0 && selectedSkills.length === skills.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="px-4 py-4">Icon</th>

              <th className="px-4 py-4">Skill</th>

              <th className="px-4 py-4">Category</th>

              <th className="px-4 py-4">Proficiency</th>

              <th className="px-4 py-4">Featured</th>

              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {skills.map((skill) => (
              <tr
                key={skill._id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="px-4 py-5">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill._id)}
                    onChange={() => toggleSkillSelection(skill._id)}
                  />
                </td>

                <td className="px-4 py-5">
                  {skill.icon ? (
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xs text-white/40">
                      N/A
                    </div>
                  )}
                </td>

                <td className="px-4 py-5 font-medium">{skill.name}</td>

                <td className="px-4 py-5">
                  <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-300">
                    {skill.category}
                  </span>
                </td>

                <td className="px-4 py-5 w-60">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${skill.proficiency}%`,
                        }}
                      />
                    </div>

                    <span className="text-sm text-white/70">
                      {skill.proficiency}%
                    </span>
                  </div>
                </td>

                <td className="px-4 py-5">
                  {skill.featured ? (
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
                      onClick={() => onEdit(skill)}
                      className="rounded-xl p-2 transition hover:bg-indigo-500/10"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(skill)}
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
