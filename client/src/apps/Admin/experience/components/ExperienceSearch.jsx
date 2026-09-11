import { Search, Star } from "lucide-react";

export default function ExperienceSearch({
  search,
  setSearch,
  employmentType,
  setEmploymentType,
  featured,
  setFeatured,
  status,
  setStatus,
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company, role or location..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 outline-none transition placeholder:text-white/30 focus:border-indigo-500/50"
        />
      </div>

      {/* Employment Type */}
      <select
        value={employmentType}
        onChange={(e) => setEmploymentType(e.target.value)}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500/50"
      >
        <option value="All">All Types</option>
        <option value="Internship">Internship</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Freelance">Freelance</option>
        <option value="Volunteer">Volunteer</option>
        <option value="Other">Other</option>
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500/50"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Archived">Archived</option>
      </select>

      {/* Featured */}
      <button
        type="button"
        onClick={() =>
          setFeatured(featured === "true" ? "all" : "true")
        }
        className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition ${
          featured === "true"
            ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
            : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
        }`}
      >
        <Star
          size={17}
          className={
            featured === "true"
              ? "fill-yellow-400"
              : ""
          }
        />

        {featured === "true"
          ? "Featured Only"
          : "All Experiences"}
      </button>
    </div>
  );
}