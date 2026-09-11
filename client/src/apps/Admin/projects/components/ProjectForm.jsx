import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import {
  createProject,
  updateProject,
} from "../../../../services/projectService";

import ProjectBasicInfo from "./ProjectBasicInfo";
import ProjectMedia from "./ProjectMedia";
import ProjectLinks from "./ProjectLinks";
import ProjectSettings from "./ProjectSettings";

import { Button } from "../../ui";

export default function ProjectForm({
  project = null,
  refresh,
  close,
}) {
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(
    project?.image || ""
  );

  const [removeCurrentImage, setRemoveCurrentImage] =
    useState(false);

  const [formData, setFormData] = useState({
    title: project?.title || "",
    subtitle: project?.subtitle || "",
    description: project?.description || "",
    category: project?.category || "Portfolio",
    image: null,
    github: project?.links?.github || "",
    liveDemo: project?.links?.live || "",
    technologies:
      project?.technologies?.join(", ") || "",
    status: project?.status || "Completed",
    featured: project?.featured || false,
  });

  function updateField(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleChange(e) {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    updateField(
      name,
      type === "checkbox"
        ? checked
        : value
    );
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

    setRemoveCurrentImage(false);

    updateField("image", file);

    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setPreview("");

    updateField("image", null);

    setRemoveCurrentImage(true);
  }

  function validate() {
    if (!formData.title.trim()) {
      toast.error("Project title is required.");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Project description is required.");
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

      payload.append("title", formData.title);
      payload.append("subtitle", formData.subtitle);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("status", formData.status);
      payload.append("featured", formData.featured);

      payload.append(
        "removeImage",
        removeCurrentImage
      );

      payload.append(
        "technologies",
        JSON.stringify(
          formData.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean)
        )
      );

      payload.append(
        "links[github]",
        formData.github
      );

      payload.append(
        "links[live]",
        formData.liveDemo
      );

      if (formData.image instanceof File) {
        payload.append(
          "image",
          formData.image
        );
      }

      if (project) {
        await updateProject(
          project._id,
          payload
        );

        toast.success(
          "Project updated successfully."
        );
      } else {
        await createProject(payload);

        toast.success(
          "Project created successfully."
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
              Saving project...
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">

        {/* Left Column */}
        <div className="space-y-8">

          <ProjectBasicInfo
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            loading={loading}
          />

          <ProjectLinks
            formData={formData}
            handleChange={handleChange}
            loading={loading}
          />

        </div>

        {/* Right Column */}
        <div className="space-y-8">

          <ProjectMedia
            preview={preview}
            loading={loading}
            processImage={processImage}
            removeImage={removeImage}
          />

          <ProjectSettings
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
            project
              ? "Updating..."
              : "Creating..."
          }
        >
          {project
            ? "Update Project"
            : "Create Project"}
        </Button>

      </div>
    </form>
  );
}