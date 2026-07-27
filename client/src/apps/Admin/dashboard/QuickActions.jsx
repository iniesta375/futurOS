import { FolderPlus, Brain, Upload } from "lucide-react";

import GlassCard from "../ui/GlassCard";

const actions = [
  {
    title: "New Project",
    icon: FolderPlus,
    key: "project",
  },

  {
    title: "New Skill",
    icon: Brain,
    key: "skill",
  },

  {
    title: "Upload Resume",
    icon: Upload,
    key: "resume",
  },
];

export default function QuickActions({ onNewProject }) {
  return (
    <GlassCard>
      <h2 className="mb-6 text-xl font-semibold">Quick Actions</h2>

      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => {
                if (action.key === "project") {
                  onNewProject();
                }
              }}
              className="glass-hover rounded-2xl p-6 transition hover:scale-[1.03]"
            >
              <Icon size={32} className="mb-4 text-accent" />

              <p>{action.title}</p>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
