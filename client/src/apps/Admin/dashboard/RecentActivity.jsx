import {
  FolderKanban,
  Brain,
  Activity,
  Trash2,
  Pencil,
  Plus,
  Archive,
  RotateCcw,
} from "lucide-react";

import GlassCard from "../ui/GlassCard";

function formatActivityDate(date) {
  if (!date) {
    return "";
  }

  const activityDate = new Date(date);
  const now = new Date();

  const difference = now.getTime() - activityDate.getTime();

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return activityDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getActivityIcon(action) {
  const normalizedAction = action?.toLowerCase() || "";

  if (normalizedAction.includes("deleted")) {
    return Trash2;
  }

  if (normalizedAction.includes("updated")) {
    return Pencil;
  }

  if (normalizedAction.includes("created")) {
    return Plus;
  }

  if (normalizedAction.includes("added")) {
    return Plus;
  }

  if (normalizedAction.includes("archived")) {
    return Archive;
  }

  if (normalizedAction.includes("restored")) {
    return RotateCcw;
  }

  return Activity;
}

export default function RecentActivity({
  activities = [],
}) {
  return (
    <GlassCard className="h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-white/50">
          Latest updates from your portfolio.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="flex min-h-50 flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/40">
            <Activity size={26} />
          </div>

          <p className="mt-4 text-sm text-white/50">
            No recent activity yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const isProject = activity.type === "project";

            const Icon = getActivityIcon(activity.action);

            return (
              <div
                key={activity.id}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                  transition
                  hover:bg-white/10
                "
              >
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/5
                    ${
                      isProject
                        ? "text-indigo-400"
                        : "text-purple-400"
                    }
                  `}
                >
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    {activity.action}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-white/35">
                  {formatActivityDate(activity.date)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}