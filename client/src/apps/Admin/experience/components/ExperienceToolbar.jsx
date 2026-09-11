import { Plus } from "lucide-react";

import { Button } from "../../ui";

import ExperienceSearch from "./ExperienceSearch";
import ExperienceStats from "./ExperienceStats";

export default function ExperienceToolbar({
  experiences,
  search,
  setSearch,
  employmentType,
  setEmploymentType,
  featured,
  setFeatured,
  status,
  setStatus,
  onAddExperience,
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Experience
          </h1>

          <p className="mt-2 text-white/60">
            Manage your professional experience and work history.
          </p>
        </div>

        <Button
          onClick={onAddExperience}
          className="lg:w-auto"
        >
          <Plus size={18} />
          Add Experience
        </Button>
      </div>

      {/* Statistics */}
      <ExperienceStats experiences={experiences} />

      {/* Search & Filters */}
      <ExperienceSearch
        search={search}
        setSearch={setSearch}
        employmentType={employmentType}
        setEmploymentType={setEmploymentType}
        featured={featured}
        setFeatured={setFeatured}
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
}