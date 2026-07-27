import { ExternalLink, Github, Star } from "lucide-react";

import GlassCard from "../../ui/GlassCard";

export default function ProjectCard({ project }) {
  return (
    <GlassCard>
      <div className="space-y-4">
        <img
          src={project.image}
          className="h-48 w-full rounded-xl object-cover"
        />

        <div className="flex items-center justify-between">
          <h3>{project.title}</h3>

          {project.featured && (
            <Star className="fill-yellow-400 text-yellow-400" />
          )}
        </div>

        <p>{project.description}</p>

        <div className="flex gap-3">
          <a href={project.liveUrl}>
            <ExternalLink />
          </a>

          <a href={project.githubUrl}>
            <Github />
          </a>
        </div>
      </div>
    </GlassCard>
  );
}
