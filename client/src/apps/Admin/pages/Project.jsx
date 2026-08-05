import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getProjects, deleteProject } from "../../../services/projectService";

import {
  Button,
  PageHeader,
  SearchInput,
  Pagination,
  ConfirmDialog,
  GlassCard,
  Select,
} from "../ui";

import ProjectTable from "../projects/components/ProjectTable";
import ProjectModal from "../projects/components/ProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const projectsPerPage = 5;

  const [showModal, setShowModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  const [selectedProjects, setSelectedProjects] = useState([]);

  const [sortBy, setSortBy] = useState("newest");

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

  async function refresh() {
    await fetchProjects();
  }

  function openCreate() {
    setSelectedProject(null);

    setShowModal(true);
  }

  function openEdit(project) {
    setSelectedProject(project);

    setShowModal(true);
  }

  function openDelete(project) {
    setProjectToDelete(project);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!projectToDelete) return;

    try {
      setDeleting(true);

      await deleteProject(projectToDelete._id);

      toast.success("Project deleted.");

      setConfirmOpen(false);

      setProjectToDelete(null);

      await fetchProjects();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  function toggleProjectSelection(id) {
    setSelectedProjects((prev) =>
      prev.includes(id)
        ? prev.filter((projectId) => projectId !== id)
        : [...prev, id],
    );
  }

  function toggleSelectAll() {
    const pageIds = paginatedProjects.map((project) => project._id);

    const allSelected = pageIds.every((id) => selectedProjects.includes(id));

    if (allSelected) {
      setSelectedProjects((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedProjects((prev) => [...new Set([...prev, ...pageIds])]);
    }
  }

  const filteredProjects = projects.filter((project) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm) ||
      project.subtitle?.toLowerCase().includes(searchTerm);

    const matchesCategory =
      categoryFilter === "All" || project.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    const matchesFeatured =
      featuredFilter === "All" ||
      (featuredFilter === "Featured" && project.featured) ||
      (featuredFilter === "Not Featured" && !project.featured);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);

      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);

      case "title-asc":
        return a.title.localeCompare(b.title);

      case "title-desc":
        return b.title.localeCompare(a.title);

      case "featured":
        return Number(b.featured) - Number(a.featured);

      case "stars":
        return (b.stars || 0) - (a.stars || 0);

      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  const startIndex = (currentPage - 1) * projectsPerPage;

  const paginatedProjects = sortedProjects.slice(
    startIndex,
    startIndex + projectsPerPage,
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, featuredFilter, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}

      <PageHeader
        title="Projects"
        subtitle="Manage your portfolio projects, featured work and case studies."
        actions={<Button onClick={openCreate}> New Project</Button>}
      />
      <GlassCard className="relative z-50 overflow-visible">
        <div className="flex flex-wrap items-end gap-4 space-y-4">
          <div className="flex-1 min-w-70">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              placeholder="Search projects..."
            />
          </div>

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Web App">Web App</option>
            <option value="Desktop App">Desktop App</option>
            <option value="Mobile App">Mobile App</option>
            <option value="API">API</option>
            <option value="AI">AI</option>
            <option value="Other">Other</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Archived">Archived</option>
          </Select>

          <Select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <option value="All">All Projects</option>
            <option value="Featured">Featured Only</option>
            <option value="Not Featured">Not Featured</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="featured">Featured First</option>
            <option value="stars">Most Stars</option>
          </Select>
        </div>
      </GlassCard>

      {/* Table */}

      <ProjectTable
        projects={paginatedProjects}
        hasProjects={projects.length > 0}
        search={search}
        onEdit={openEdit}
        onDelete={openDelete}
        onCreate={openCreate}
        loading={loading}
        selectedProjects={selectedProjects}
        toggleProjectSelection={toggleProjectSelection}
        toggleSelectAll={toggleSelectAll}
      />
      <div className="pt-4">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal */}

      {showModal && (
        <ProjectModal
          close={() => setShowModal(false)}
          refresh={refresh}
          project={selectedProject}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Project?"
        message={`Are you sure you want to delete "${
          projectToDelete?.title || ""
        }"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onCancel={() => {
          setConfirmOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
