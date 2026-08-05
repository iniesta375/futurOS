import { motion, AnimatePresence } from "framer-motion";

import { Pencil, Trash2, Star, FolderOpen } from "lucide-react";

import {
  GlassCard,
  Table,
  TableRow,
  TableCell,
  Badge,
  StatusBadge,
  LoadingSkeleton,
  EmptyState,
} from "../../ui";

export default function ProjectTable({
  projects,
  loading,
  hasProjects,
  search,
  onEdit,
  onDelete,
  onCreate,
  selectedProjects,
  toggleProjectSelection,
  toggleSelectAll,
}) {
  if (loading) {
    return (
      <GlassCard>
        <LoadingSkeleton rows={8} className="p-8" />
      </GlassCard>
    );
  }

  const allSelected =
    projects.length > 0 &&
    projects.every((project) => selectedProjects.includes(project._id));

  if (projects.length === 0) {
  return (
    <GlassCard>
      <EmptyState
        icon={<FolderOpen size={64} />}
        title={
          hasProjects
            ? "No Matching Projects"
            : "No Projects Yet"
        }
        subtitle={
          hasProjects
            ? "Try changing your search or filters."
            : "Create your first portfolio project."
        }
        buttonText={
          hasProjects ? "Clear Filters" : "Create Project"
        }
        onAction={
          hasProjects
            ? () => window.location.reload()
            : () => onCreate?.()
        }
      />
    </GlassCard>
  );
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <GlassCard className="overflow-visible z-0 relative">
        <div className="overflow-x-auto">
          <Table>
          <thead className="sticky top-0 bg-[#10131d]">
            <TableRow>
              <TableCell header className="w-14">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="
                  h-4
                  w-4
                  cursor-pointer
                  rounded
                  bg-transparent
                  text-indigo-500
                  focus:ring-indigo-500
                "
                />
              </TableCell>

              <TableCell header className="w-[35%]">
                Project
              </TableCell>

              <TableCell header className="w-[15%]">
                Category
              </TableCell>

              <TableCell header className="w-[15%]">
                Status
              </TableCell>

              <TableCell header className="w-[15%]">
                Featured
              </TableCell>

              <TableCell header className="w-35 text-center">
                Actions
              </TableCell>
            </TableRow>
          </thead>

          <tbody>
            {projects.map((project) => (
              <TableRow
                key={project._id}
                onClick={() => onEdit(project)}
                className="
                hover:bg-indigo-500/5
                hover:-translate-y-0.5
              "
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project._id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleProjectSelection(project._id)}
                    className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                    border-white/20
                    bg-transparent
                    text-indigo-500
                    focus:ring-indigo-500
                  "
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        project.image ||
                        "https://placehold.co/80x80?text=No+Image"
                      }
                      alt={project.title}
                      className="
      h-16
      w-16
      rounded-2xl
      border
      border-white/10
      object-cover
      shadow-lg
      shrink-0
    "
                    />

                    <div className="min-w-0">
                      <h4 className="truncate font-semibold text-white">
                        {project.title}
                      </h4>

                      <p className="mt-1 truncate text-sm text-white/50">
                        {project.subtitle || "No subtitle"}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="primary">
                    {project.category || "Uncategorized"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>

                <TableCell>
                  {project.featured ? (
                    <Badge variant="warning" icon={<Star size={14} />}>
                      Featured
                    </Badge>
                  ) : (
                    <Badge variant="gray">Standard</Badge>
                  )}
                </TableCell>

                <TableCell className="text-white/60">
                  {new Date(project.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell>
                  <div
                    className="flex justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onEdit(project)}
                      title="Edit Project"
                      className="
    rounded-xl
    bg-indigo-500/10
    p-2.5
    text-indigo-400
    transition-all
    duration-300
    hover:scale-110
    hover:bg-indigo-500/20
  "
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(project)}
                      title="Delete Project"
                      className="
    rounded-xl
    bg-rose-500/10
    p-2.5
    text-rose-400
    transition-all
    duration-300
    hover:scale-110
    hover:bg-rose-500/20
  "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        </div>
        
      </GlassCard>
    </motion.div>
  );
}
