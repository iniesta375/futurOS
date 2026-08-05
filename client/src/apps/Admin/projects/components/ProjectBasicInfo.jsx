import { FolderOpen } from "lucide-react";

import { Input } from "../../ui";
import RichTextEditor from "../../ui/RichTextEditor/RichTextEditor";

export default function ProjectBasicInfo({
  formData,
  setFormData,
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
        <FolderOpen size={20} className="text-indigo-400" />

        <h3 className="text-lg font-semibold">
          Basic Information
        </h3>
      </div>

      <div className="space-y-6">
        <Input
          label="Project Title"
          required
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="FuturOS Portfolio"
          disabled={loading}
        />

        <Input
          label="Subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          placeholder="Modern Desktop Portfolio"
          disabled={loading}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Description
          </label>

          <RichTextEditor
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                description: value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}