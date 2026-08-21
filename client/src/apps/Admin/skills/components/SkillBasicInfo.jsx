import { Cpu } from "lucide-react";

import { Input } from "../../ui";

export default function SkillBasicInfo({
  formData,
  setFormData,
  loading,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <Cpu
          size={20}
          className="text-indigo-400"
        />

        <h3 className="text-lg font-semibold">
          Basic Information
        </h3>
      </div>

      <Input
        label="Skill Name"
        required
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="React"
        disabled={loading}
      />

      <Input
        label="Proficiency (%)"
        type="number"
        name="proficiency"
        min="0"
        max="100"
        value={formData.proficiency}
        onChange={handleChange}
        placeholder="90"
        disabled={loading}
        helperText="Value between 0 and 100."
      />
    </section>
  );
}