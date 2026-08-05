import {
  FolderPlus,
  Brain,
  Upload,
  ArrowRight,
} from "lucide-react";

import GlassCard from "../ui/GlassCard";

const actions = [
  {
    title: "New Project",
    description: "Create a portfolio project",
    icon: FolderPlus,
    key: "project",
    color: "text-indigo-400",
  },
  {
    title: "New Skill",
    description: "Coming Soon",
    icon: Brain,
    key: "skill",
    color: "text-purple-400",
    disabled: true,
  },
  {
    title: "Upload Resume",
    description: "Coming Soon",
    icon: Upload,
    key: "resume",
    color: "text-sky-400",
    disabled: true,
  },
];

export default function QuickActions({ onNewProject }) {
  return (
    <GlassCard className="h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-white/50">
            Jump into your most common tasks.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              disabled={action.disabled}
              onClick={() => {
                if (action.key === "project") {
                  onNewProject();
                }
              }}
              className={`
                group
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-6
                text-left
                transition-all
                duration-300
                hover:border-indigo-500/40
                hover:bg-white/10
                hover:-translate-y-1
                disabled:cursor-not-allowed
                disabled:opacity-60
              `}
            >
              <div
                className={`
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/5
                  ${action.color}
                `}
              >
                <Icon size={30} />
              </div>

              <h3 className="text-lg font-semibold">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-white/50">
                {action.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-indigo-400 opacity-0 transition group-hover:opacity-100">
                <span>Open</span>

                <ArrowRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}