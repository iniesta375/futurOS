import { Settings } from "lucide-react";

import { Select, Checkbox } from "../../ui";

const categoryOptions = [
  { label: "Portfolio", value: "Portfolio" },
  { label: "Web App", value: "Web App" },
  { label: "Desktop App", value: "Desktop App" },
  { label: "Mobile App", value: "Mobile App" },
  { label: "API", value: "API" },
  { label: "AI", value: "AI" },
  { label: "Other", value: "Other" },
];

const statusOptions = [
  { label: "Completed", value: "Completed" },
  { label: "In Progress", value: "In Progress" },
  { label: "Archived", value: "Archived" },
];

export default function ProjectSettings({ formData, setFormData, loading }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <Settings size={20} className="text-indigo-400" />

        <h3 className="text-lg font-semibold">Project Settings</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
          disabled={loading}
        >
          <option value="Portfolio">Portfolio</option>
          <option value="Web App">Web App</option>
          <option value="Desktop App">Desktop App</option>
          <option value="Mobile App">Mobile App</option>
          <option value="API">API</option>
          <option value="AI">AI</option>
          <option value="Other">Other</option>
        </Select>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              status: e.target.value,
            }))
          }
          disabled={loading}
        >
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Archived">Archived</option>
        </Select>
      </div>

      <Checkbox
        label="Featured Project"
        helperText="Featured projects appear first on your portfolio."
        checked={formData.featured}
        disabled={loading}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            featured: e.target.checked,
          }))
        }
      />
    </section>
  );
}
