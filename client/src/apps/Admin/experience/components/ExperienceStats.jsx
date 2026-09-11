import GlassCard from "../../ui/GlassCard";

export default function ExperienceStats({ experiences }) {
  const active = experiences.filter(
    (experience) => experience.status === "Active"
  ).length;

  const archived = experiences.filter(
    (experience) => experience.status === "Archived"
  ).length;

  const featured = experiences.filter(
    (experience) => experience.featured
  ).length;

  const current = experiences.filter(
    (experience) => experience.current
  ).length;

  const stats = [
    {
      label: "Total",
      value: experiences.length,
    },
    {
      label: "Active",
      value: active,
    },
    {
      label: "Featured",
      value: featured,
    },
    {
      label: "Current",
      value: current,
    },
    {
      label: "Archived",
      value: archived,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <GlassCard key={stat.label}>
          <p className="text-sm text-white/50">
            {stat.label}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stat.value}
          </p>
        </GlassCard>
      ))}
    </div>
  );
}