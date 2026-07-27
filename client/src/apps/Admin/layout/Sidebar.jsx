import {
  LayoutDashboard,
  FolderKanban,
  Brain,
  Newspaper,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { logout } from "../../../services/authService";

const menu = [
  {
    title: "Overview",

    items: [
      {
        key: "dashboard",

        icon: LayoutDashboard,

        label: "Dashboard",
      },
    ],
  },

  {
    title: "Content",

    items: [
      {
        key: "projects",

        icon: FolderKanban,

        label: "Projects",
      },

      {
        key: "skills",

        icon: Brain,

        label: "Skills",
      },

      {
        key: "blog",

        icon: Newspaper,

        label: "Blog",
      },
    ],
  },

  {
    title: "Insights",

    items: [
      {
        key: "analytics",

        icon: BarChart3,

        label: "Analytics",
      },
    ],
  },

  {
    title: "System",

    items: [
      {
        key: "settings",

        icon: Settings,

        label: "Settings",
      },
    ],
  },
];

export default function Sidebar({
  page,

  setPage,
}) {
  return (
    <aside className="glass flex w-72 flex-col border-r border-white/10 p-6">
      <div>
        <h1 className="font-display text-3xl text-gradient">FuturOS</h1>

        <p className="text-white/50">Studio</p>
      </div>

      <div className="mt-10 flex-1 space-y-8">
        {menu.map((section) => (
          <div key={section.title}>
            <p className="mb-3 text-xs uppercase tracking-widest text-white/40">
              {section.title}
            </p>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    onClick={() => setPage(item.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition

                                                ${
                                                  page === item.key
                                                    ? "bg-indigo-600 text-white"
                                                    : "glass-hover"
                                                }`}
                  >
                    <Icon size={18} />

                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          logout();

          window.location.reload();
        }}
        className="flex items-center gap-3 rounded-xl bg-red-500/20 px-4 py-3 text-red-300"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
