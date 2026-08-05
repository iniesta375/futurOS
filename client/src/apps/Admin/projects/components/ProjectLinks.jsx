import { Link2 } from "lucide-react";

import { Input } from "../../ui";

export default function ProjectLinks({
  formData,
  handleChange,
  loading,
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-xl
      "
    >
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-3">
        <Link2
          size={20}
          className="text-indigo-400"
        />

        <h3 className="text-lg font-semibold">
          Links & Technologies
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="GitHub URL"
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="https://github.com/..."
          disabled={loading}
        />

        <Input
          label="Live Demo"
          name="liveDemo"
          value={formData.liveDemo}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
          disabled={loading}
        />
      </div>

      <div className="mt-6">
        <Input
          label="Technologies"
          helperText="Separate technologies with commas."
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, Node.js, Express, MongoDB"
          disabled={loading}
        />
      </div>
    </div>
  );
}