import { Award, Star, BarChart3, Layers3 } from "lucide-react";

import StatCard from "../../ui/StatCard";

export default function SkillStats({ skills = [] }) {
  const totalSkills = skills.length;

  const featuredSkills = skills.filter((skill) => skill.featured).length;

  const averageProficiency =
    totalSkills === 0
      ? 0
      : Math.round(
          skills.reduce((sum, skill) => sum + skill.proficiency, 0) /
            totalSkills,
        );

  const totalCategories = new Set(skills.map((skill) => skill.category)).size;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Skills" value={totalSkills} icon={Award} />

      <StatCard title="Featured" value={featuredSkills} icon={Star} />

      <StatCard
        title="Average Proficiency"
        value={`${averageProficiency}%`}
        icon={BarChart3}
      />

      <StatCard title="Categories" value={totalCategories} icon={Layers3} />
    </div>
  );
}
