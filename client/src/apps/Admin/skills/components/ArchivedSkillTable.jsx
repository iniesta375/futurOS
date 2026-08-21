import {
  RotateCcw,
  Trash2,
} from "lucide-react";

import GlassCard from "../../ui/GlassCard";
import EmptyState from "../../ui/EmptyState";

export default function ArchivedSkillTable({
  skills,
  loading,
  onRestore,
  onDelete,
}) {
  if (loading) {
    return (
      <GlassCard>
        <div className="py-20 text-center">
          Loading archived skills...
        </div>
      </GlassCard>
    );
  }

  if (!skills.length) {
    return (
      <GlassCard>
        <EmptyState
          title="No archived skills"
          description="Archived skills will appear here."
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="p-4">Skill</th>
            <th className="p-4">Category</th>
            <th className="p-4">Proficiency</th>
            <th className="p-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {skills.map((skill) => (
            <tr
              key={skill._id}
              className="border-b border-white/5"
            >
              <td className="p-4">
                {skill.name}
              </td>

              <td className="p-4">
                {skill.category}
              </td>

              <td className="p-4">
                {skill.proficiency}%
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      onRestore(skill._id)
                    }
                    className="rounded-xl p-2 hover:bg-green-500/10"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    onClick={() =>
                      onDelete(skill._id)
                    }
                    className="rounded-xl p-2 hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}