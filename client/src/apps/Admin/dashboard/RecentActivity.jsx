import {
  FolderKanban,
  Pencil,
  PlusCircle,
  Image,
} from "lucide-react";

import GlassCard from "../ui/GlassCard";

const activities = [
  {
    icon: PlusCircle,
    title: "Created PawPalace",
    time: "2 minutes ago",
  },
  {
    icon: Pencil,
    title: "Updated React Skill",
    time: "20 minutes ago",
  },
  {
    icon: Image,
    title: "Uploaded Portfolio Image",
    time: "Yesterday",
  },
  {
    icon: FolderKanban,
    title: "Edited Contact Details",
    time: "2 days ago",
  },
];

export default function RecentActivity() {
  return (
    <GlassCard hover={false}>
      <h2 className="mb-6 text-xl font-semibold">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-500/30 hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Icon size={22} />
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  {activity.title}
                </p>

                <p className="text-sm text-white/50">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}