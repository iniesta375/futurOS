import { CalendarDays, FolderKanban, Star } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function LatestProject({ project }) {
  if (!project) {
    return (
      <GlassCard>
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <FolderKanban
            size={48}
            className="mb-4 text-white/20"
          />

          <h2 className="text-xl font-semibold">
            No Projects Yet
          </h2>

          <p className="mt-2 text-sm text-white/50">
            Create your first project to see it here.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h2 className="mb-6 text-xl font-semibold">
        Latest Project
      </h2>

      <div className="space-y-5">
        <img
          src={
            project.image ||
            "https://placehold.co/600x320?text=No+Image"
          }
          alt={project.title}
          className="h-52 w-full rounded-2xl border border-white/10 object-cover"
        />

        <div>
          <h3 className="text-2xl font-bold">
            {project.title}
          </h3>

          {project.subtitle && (
            <p className="mt-1 text-white/60">
              {project.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-indigo-500/15 px-4 py-1 text-sm text-indigo-400">
            {project.category}
          </span>

          <span
            className={`rounded-full px-4 py-1 text-sm ${
              project.status === "Completed"
                ? "bg-green-500/15 text-green-400"
                : "bg-yellow-500/15 text-yellow-400"
            }`}
          >
            {project.status}
          </span>

          {project.featured && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500/15 px-4 py-1 text-sm text-yellow-400">
              <Star size={14} />
              Featured
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-white/50">
          <CalendarDays size={16} />

          <span>
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}