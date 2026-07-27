import { Pencil, Trash2, Star } from "lucide-react";

import GlassCard from "../../ui/GlassCard";

export default function ProjectTable({
  projects,

  loading,

  onEdit,

  onDelete,
}) {
  if (loading) {
    return <GlassCard>Loading...</GlassCard>;
  }

  return (
    <GlassCard>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 text-left">Title</th>

            <th>Category</th>

            <th>Featured</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-10 text-center text-white/50">
                No Projects Yet
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project._id} className="border-b border-white/5">
                <td className="py-4">{project.title}</td>

                <td>{project.category}</td>

                <td>
                  {project.featured ? (
                    <Star
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <div className="flex gap-3">
                    <button onClick={() => onEdit(project)}>
                      <Pencil size={18} />
                    </button>

                    <button onClick={() => onDelete(project)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </GlassCard>
  );
}
