import { Image } from "lucide-react";

import { FileUpload } from "../../ui";

export default function ProjectMedia({
  preview,
  loading,
  processImage,
  removeImage,
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/3
        p-6
        backdrop-blur-xl
      "
    >
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-3">
        <Image
          size={20}
          className="text-indigo-400"
        />

        <h3 className="text-lg font-semibold">
          Project Media
        </h3>
      </div>

      <FileUpload
        label="Project Image"
        value={preview}
        loading={loading}
        onChange={processImage}
        onRemove={removeImage}
      />
    </div>
  );
}