import { useState } from "react";

import { toast } from "react-toastify";
import { createProject, updateProject } from "../../../../services/projectService";

export default function ProjectForm({

    project = null,

    refresh,

    close,


}){

    const [loading, setLoading] = useState(false);

const [formData, setFormData] = useState({

    title: project?.title || "",

    subtitle: project?.subtitle || "",

    description: project?.description || "",

    category: project?.category || "Portfolio",

    image: project?.image || "",

    github: project?.github || "",

    liveDemo: project?.liveDemo || "",

    technologies: project?.technologies?.join(", ") || "",

    status: project?.status || "Completed",

    featured: project?.featured || false,

});

   function handleChange(e) {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({

        ...prev,

        [name]:

            type === "checkbox"

                ? checked

                : value,

    }));

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

    if (!validate()) return;

    try {

        setLoading(true);

        const payload = {

            ...formData,

            technologies:

                formData.technologies

                    .split(",")

                    .map((tech) => tech.trim())

                    .filter(Boolean),

        };

        if (project) {

            await updateProject(

                project._id,

                payload

            );

            toast.success(

                "Project updated successfully."

            );

        }

        else {

            await createProject(

                payload

            );

            toast.success(

                "Project created successfully."

            );

        }

        await refresh();

        close();

    }

    catch (err) {

        toast.error(err.message || "Something went wrong.");

    }

    finally {

        setLoading(false);

    }

}

   return (

    <form
        onSubmit={handleSubmit}
        className="space-y-6"
    >

        {/* Title */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Project Title
            </label>

            <input
                disabled={loading}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="FuturOS Portfolio"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-indigo-500"
            />

        </div>

        {/* Subtitle */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Subtitle
            </label>

            <input
                disabled={loading}
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Modern Desktop Portfolio"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-indigo-500"
            />

        </div>

        {/* Description */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Description
            </label>

            <textarea
                disabled={loading}
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write something about the project..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-indigo-500"
            />

        </div>

        {/* Category */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Category
            </label>

            <select
                disabled={loading}
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
            >

                <option>Portfolio</option>

                <option>Web App</option>

                <option>Desktop App</option>

                <option>Mobile App</option>

                <option>API</option>

                <option>AI</option>

                <option>Other</option>

            </select>

        </div>

        {/* Image */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Image URL
            </label>

            <input
                disabled={loading}
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
            />

        </div>

        {/* Github */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Github URL
            </label>

            <input
                disabled={loading}
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
            />

        </div>

        {/* Live Demo */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Live Demo
            </label>

            <input
                disabled={loading}
                type="text"
                name="liveDemo"
                value={formData.liveDemo}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
            />

        </div>

        {/* Technologies */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Technologies
            </label>

            <input
                disabled={loading}
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node, MongoDB"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
            />

            <p className="mt-2 text-xs text-white/50">

                Separate technologies with commas.

            </p>

        </div>

        {/* Status */}

        <div>

            <label className="mb-2 block text-sm font-medium">
                Status
            </label>

            <select
                disabled={loading}
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
            >

                <option>Completed</option>

                <option>In Progress</option>

                <option>Archived</option>

            </select>

        </div>

        {/* Featured */}

        <div className="flex items-center gap-3">

            <input
                disabled={loading}
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
            />

            <label>

                Featured Project

            </label>

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 pt-4">

            <button
                type="button"
                onClick={close}
                disabled={loading}
                className="rounded-xl border border-white/10 px-6 py-3"
            >

                Cancel

            </button>

            <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-700 disabled:opacity-50"
            >

                {loading
                    ? "Saving..."
                    : project
                    ? "Update Project"
                    : "Create Project"}

            </button>

        </div>

    </form>

);
}