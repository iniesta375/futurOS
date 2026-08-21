import { useEffect, useState } from "react";
import {
  FolderKanban,
  Star,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import DashboardGreeting from "./DashboardGreeting";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import SystemHealth from "./SystemHealth";
import LatestProject from "./LatestProject";

import { getDashboardStats } from "../../../services/dashboardService";

export default function Dashboard({ setPage }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardStats();

        console.log("DASHBOARD DATA:", data);

        setStats(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Greeting skeleton */}
        <div className="space-y-3">
          <div className="h-12 w-72 rounded-2xl bg-white/5" />
          <div className="h-5 w-48 rounded-xl bg-white/5" />
          <div className="h-5 w-full max-w-2xl rounded-xl bg-white/5" />
        </div>

        {/* Stats skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-44 rounded-3xl bg-white/5"
            />
          ))}
        </div>

        {/* Latest project + quick actions */}
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-80 rounded-3xl bg-white/5 xl:col-span-2" />
          <div className="h-80 rounded-3xl bg-white/5" />
        </div>

        {/* Activity + system health */}
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-96 rounded-3xl bg-white/5" />
          <div className="h-96 rounded-3xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <DashboardGreeting />

      {/* Statistics */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projects"
          value={stats?.totalProjects ?? 0}
          subtitle="Portfolio projects"
          icon={<FolderKanban size={30} />}
          iconColor="text-indigo-400"
        />

        <StatCard
          title="Featured"
          value={stats?.featuredProjects ?? 0}
          subtitle="Highlighted projects"
          icon={<Star size={30} />}
          iconColor="text-yellow-400"
        />

        <StatCard
          title="In Progress"
          value={stats?.inProgressProjects ?? 0}
          subtitle="Currently building"
          icon={<Clock3 size={30} />}
          iconColor="text-sky-400"
        />

        <StatCard
          title="Completed"
          value={stats?.completedProjects ?? 0}
          subtitle="Finished projects"
          icon={<CheckCircle2 size={30} />}
          iconColor="text-green-400"
        />
      </section>

      {/* Latest Project + Quick Actions */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <LatestProject
            project={stats?.latestProject}
          />
        </div>

        <QuickActions
          onNewProject={() => setPage("projects")}
        />
      </section>

      {/* Recent Activity + System Health */}
      <section className="grid gap-6 xl:grid-cols-2">
        <RecentActivity
          activities={stats?.recentActivity ?? []}
        />

        <SystemHealth />
      </section>
    </div>
  );
}