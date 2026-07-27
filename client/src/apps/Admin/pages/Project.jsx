import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getProjects,
  deleteProject,
} from "../../../services/projectService";

import ProjectTable from "../projects/components/ProjectTable";
import ProjectModal from "../projects/components/ProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  // ===========================
  // Fetch Projects
  // ===========================

  async function fetchProjects() {
    try {
      setLoading(true);

      const data = await getProjects();

      setProjects(data);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // ===========================
  // Refresh
  // ===========================

  async function refresh() {
    await fetchProjects();
  }

  // ===========================
  // Create
  // ===========================

  function openCreate() {
    setSelectedProject(null);

    setShowModal(true);
  }

  // ===========================
  // Edit
  // ===========================

  function openEdit(project) {
    setSelectedProject(project);

    setShowModal(true);
  }

  // ===========================
  // Delete
  // ===========================

  async function handleDelete(project) {
    const confirmDelete = window.confirm(
      `Delete "${project.title}" ?`
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(project._id);

      toast.success("Project deleted.");

      fetchProjects();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>

          <h1 className="text-3xl font-bold">

            Projects

          </h1>

          <p className="text-white/60">

            Manage your portfolio projects.

          </p>

        </div>

        <button
          onClick={openCreate}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-medium transition hover:bg-indigo-700"
        >
          + New Project
        </button>
      </div>

      {/* Table */}

      <ProjectTable
        projects={projects}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}

      {showModal && (
        <ProjectModal
          close={() => setShowModal(false)}
          refresh={refresh}
          project={selectedProject}
        />
      )}
    </div>
  );
}