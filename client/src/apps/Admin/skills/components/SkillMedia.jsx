import { Image } from "lucide-react";

import { FileUpload } from "../../ui";

export default function SkillMedia({
  preview,
  loading,
  processImage,
  removeImage,
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <Image
          size={20}
          className="text-indigo-400"
        />

        <h3 className="text-lg font-semibold">
          Skill Icon
        </h3>
      </div>

      <FileUpload
        label="Skill Icon"
        value={preview}
        loading={loading}
        onChange={processImage}
        onRemove={removeImage}
      />
    </section>
  );
}