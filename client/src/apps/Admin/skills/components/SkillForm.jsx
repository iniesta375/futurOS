import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import {
  createSkill,
  updateSkill,
} from "../../../../services/skillsService";

import SkillBasicInfo from "./SkillBasicInfo";
import SkillMedia from "./SkillMedia";
import SkillSettings from "./SkillSettings";

import { Button } from "../../ui";

export default function SkillForm({
  skill = null,
  refresh,
  close,
}) {
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(
    skill?.icon || ""
  );

  const [removeCurrentIcon, setRemoveCurrentIcon] =
    useState(false);

  const [formData, setFormData] = useState({
    name: skill?.name || "",
    category: skill?.category || "Frontend",
    proficiency: skill?.proficiency || 80,
    featured: skill?.featured || false,
    icon: null,
  });

  function updateField(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function processImage(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    setRemoveCurrentIcon(false);

    updateField("icon", file);

    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setPreview("");

    updateField("icon", null);

    setRemoveCurrentIcon(true);
  }

  function validate() {
    if (!formData.name.trim()) {
      toast.error("Skill name is required.");
      return false;
    }

    if (
      formData.proficiency < 0 ||
      formData.proficiency > 100
    ) {
      toast.error(
        "Proficiency must be between 0 and 100."
      );
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append(
        "proficiency",
        formData.proficiency
      );
      payload.append(
        "featured",
        formData.featured
      );
      payload.append(
        "removeIcon",
        removeCurrentIcon
      );

      if (formData.icon instanceof File) {
        payload.append("icon", formData.icon);
      }

      if (skill) {
        await updateSkill(skill._id, payload);

        toast.success(
          "Skill updated successfully."
        );
      } else {
        await createSkill(payload);

        toast.success(
          "Skill created successfully."
        );
      }

      await refresh();

      close();
    } catch (err) {
      toast.error(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative"
    >
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle
              size={42}
              className="animate-spin text-indigo-400"
            />

            <p className="text-white/80">
              Saving skill...
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <SkillBasicInfo
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        </div>

        <div className="space-y-8">
          <SkillMedia
            preview={preview}
            loading={loading}
            processImage={processImage}
            removeImage={removeImage}
          />

          <SkillSettings
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4 border-t border-white/10 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={close}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={loading}
          loadingText={
            skill
              ? "Updating..."
              : "Creating..."
          }
        >
          {skill
            ? "Update Skill"
            : "Create Skill"}
        </Button>
      </div>
    </form>
  );
}