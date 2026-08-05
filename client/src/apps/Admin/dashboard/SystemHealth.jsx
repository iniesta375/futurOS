import {
  CheckCircle2,
  Database,
  Cloud,
  ShieldCheck,
  Server,
} from "lucide-react";

import GlassCard from "../ui/GlassCard";

const services = [
  {
    name: "Backend API",
    description: "Express Server",
    icon: Server,
    status: "Operational",
    color: "text-emerald-400",
  },
  {
    name: "MongoDB",
    description: "Database Connected",
    icon: Database,
    status: "Connected",
    color: "text-green-400",
  },
  {
    name: "Cloudinary",
    description: "Image Storage",
    icon: Cloud,
    status: "Active",
    color: "text-sky-400",
  },
  {
    name: "Authentication",
    description: "JWT Protected",
    icon: ShieldCheck,
    status: "Secure",
    color: "text-indigo-400",
  },
];

export default function SystemHealth() {
  return (
    <GlassCard>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            System Health
          </h2>

          <p className="mt-1 text-sm text-white/50">
            Current status of all connected services.
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-400">
          All Systems Operational
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.name}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                py-4
                transition-all
                duration-300
                hover:border-indigo-500/30
                hover:bg-white/10
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/5
                    ${service.color}
                  `}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <h3 className="font-medium">
                    {service.name}
                  </h3>

                  <p className="text-sm text-white/45">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                <CheckCircle2 size={16} />
                {service.status}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}