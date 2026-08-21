import { Settings } from "lucide-react";

import { Select, Checkbox } from "../../ui";

export default function SkillSettings({
  formData,
  setFormData,
  loading,
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <Settings
          size={20}
          className="text-indigo-400"
        />

        <h3 className="text-lg font-semibold">
          Skill Settings
        </h3>
      </div>

      <Select
        label="Category"
        value={formData.category}
        disabled={loading}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            category: e.target.value,
          }))
        }
      >
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Database">Database</option>
        <option value="DevOps">DevOps</option>
        <option value="Mobile">Mobile</option>
        <option value="Tools">Tools</option>
        <option value="Design">Design</option>
        <option value="Other">Other</option>
      </Select>

      <Checkbox
        label="Featured Skill"
        helperText="Featured skills appear first on your portfolio."
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