import { useState } from "react";
import { motion } from "framer-motion";
import { LoaderCircle, FolderOpen, Image, Link2, Settings } from "lucide-react";
import { toast } from "react-toastify";

import {
  createProject,
  updateProject,
} from "../../../../services/projectService";

import { Input, Select, Checkbox, Button, FileUpload } from "../../ui";

import RichTextEditor from "../../ui/RichTextEditor/RichTextEditor";

export default function ProjectForm({ project = null, refresh, close }) {
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(project?.image || "");

  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  const [formData, setFormData] = useState({
    title: project?.title || "",

    subtitle: project?.subtitle || "",

    description: project?.description || "",

    category: project?.category || "Portfolio",

    image: null,

    github: project?.links?.github || "",

    liveDemo: project?.links?.live || "",

    technologies: project?.technologies?.join(", ") || "",

    status: project?.status || "Completed",

    featured: project?.featured || false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    setRemoveCurrentImage(false);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setPreview("");

    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

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

      payload.append("removeImage", removeCurrentImage);

      payload.append(
        "technologies",
        JSON.stringify(
          formData.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),
        ),
      );

      payload.append("links[github]", formData.github);

      payload.append("links[live]", formData.liveDemo);

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      if (project) {
        await updateProject(project._id, payload);

        toast.success("Project updated successfully.");
      } else {
        await createProject(payload);

        toast.success("Project created successfully.");
      }

      await refresh();

      close();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-8">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle size={42} className="animate-spin text-indigo-400" />

            <p className="text-white/80">Saving project...</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <FolderOpen size={20} className="text-indigo-400" />

          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>

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
          <label className="mb-2 block text-sm font-medium">Description</label>

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

      {/* <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        disabled={loading}
      >
        <option>Portfolio</option>
        <option>Web App</option>
        <option>Desktop App</option>
        <option>Mobile App</option>
        <option>API</option>
        <option>AI</option>
        <option>Other</option>
      </Select> */}

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Image size={20} className="text-indigo-400" />

          <h3 className="text-lg font-semibold">Project Media</h3>
        </div>

        <FileUpload
          label="Project Image"
          value={preview}
          loading={loading}
          onChange={processImage}
          onRemove={removeImage}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Link2 size={20} className="text-indigo-400" />

          <h3 className="text-lg font-semibold">Links & Technologies</h3>
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
            placeholder="https://..."
            disabled={loading}
          />
        </div>

        <Input
          label="Technologies"
          helperText="Separate with commas."
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
          disabled={loading}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Settings size={20} className="text-indigo-400" />

          <h3 className="text-lg font-semibold">Project Settings</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option>Portfolio</option>
            <option>Web App</option>
            <option>Desktop App</option>
            <option>Mobile App</option>
            <option>API</option>
            <option>AI</option>
            <option>Other</option>
          </Select>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option>Completed</option>
            <option>In Progress</option>
            <option>Archived</option>
          </Select>
        </div>

        <Checkbox
          label="Featured Project"
          helperText="Featured projects appear first on your portfolio."
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="secondary" onClick={close} disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          loading={loading}
          loadingText={project ? "Updating..." : "Creating..."}
        >
          {project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
