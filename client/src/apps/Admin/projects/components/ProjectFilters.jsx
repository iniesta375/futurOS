export default function ProjectFilters() {
  return (
    <div className="glass flex flex-wrap gap-4 rounded-2xl p-5">
      <input
        placeholder="Search project..."
        className="flex-1 rounded-xl bg-white/5 px-4 py-3 outline-none"
      />

      <select className="rounded-xl bg-white/5 px-4 py-3">
        <option>All Categories</option>
      </select>

      <select className="rounded-xl bg-white/5 px-4 py-3">
        <option>All Projects</option>

        <option>Featured</option>
      </select>
    </div>
  );
}
