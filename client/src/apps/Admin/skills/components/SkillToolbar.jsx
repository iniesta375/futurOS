import { Plus } from "lucide-react";

import { Button } from "../../ui";

import SkillSearch from "./SkillSearch";
import SkillStats from "./SkillStats";

export default function SkillToolbar({
  skills,

  search,
  setSearch,

  category,
  setCategory,

  featured,
  setFeatured,

  onAddSkill,
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Skills
          </h1>

          <p className="mt-2 text-white/60">
            Manage your technical skills and proficiency.
          </p>
        </div>

        <Button
          onClick={onAddSkill}
          className="lg:w-auto"
        >
          <Plus size={18} />

          Add Skill
        </Button>
      </div>

      {/* Statistics */}
      <SkillStats skills={skills} />

      {/* Search & Filters */}
      <SkillSearch
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        featured={featured}
        setFeatured={setFeatured}
      />
    </div>
  );
}