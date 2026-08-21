import { Link2 } from "lucide-react";

import { Input } from "../../ui";

export default function ProjectLinks({
  formData,
  handleChange,
  loading,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          Links & Technologies
        </h3>

        <p className="mt-1 text-sm text-white/45">
          Add your project links and the technologies used.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="GitHub URL"
          name="github"
          value={formData.github || ""}
          onChange={handleChange}
          placeholder="https://github.com/..."
          disabled={loading}
        />

        <Input
          label="Live Demo"
          name="liveDemo"
          value={formData.liveDemo || ""}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
          disabled={loading}
        />
      </div>

      <div>
        <Input
          label="Technologies"
          helperText="Separate technologies with commas."
          name="technologies"
          value={formData.technologies || ""}
          onChange={handleChange}
          placeholder="React, Node.js, Express, MongoDB"
          disabled={loading}
        />
      </div>
    </div>
  );
}