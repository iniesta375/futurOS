import { Search, X } from "lucide-react";

import { Input, Select, Button } from "../../ui";

export default function SkillSearch({
  search,
  setSearch,
  category,
  setCategory,
  featured,
  setFeatured,
}) {
  function clearFilters() {
    setSearch("");
    setCategory("All");
    setFeatured("All");
  }

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
      "
    >
      <div className="grid gap-5 lg:grid-cols-4">
        <Input
          label="Search"
          placeholder="React, Node.js..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          leftIcon={<Search size={18} />}
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Database">Database</option>
          <option value="DevOps">DevOps</option>
          <option value="Mobile">Mobile</option>
          <option value="Tools">Tools</option>
          <option value="Design">Design</option>
          <option value="Other">Other</option>
        </Select>

        <Select
          label="Featured"
          value={featured}
          onChange={(e) =>
            setFeatured(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Featured">
            Featured
          </option>
          <option value="Not Featured">
            Not Featured
          </option>
        </Select>

        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            onClick={clearFilters}
            className="w-full"
          >
            <X size={18} />

            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}