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
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const projectsPerPage = 5;

  const [showModal, setShowModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

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

  
  async function handleDelete(project) {
    const confirmDelete = window.confirm(
      `Delete "${project.title}" ?`
    );

    if (!confirmDelete) return;

    try {
      await deleteProject(project._id);

      toast.success("Project deleted.");

      await fetchProjects();
    } catch (err) {
      toast.error(err.message);
    }
  }

 const filteredProjects = projects.filter((project) => {
  const searchTerm = search.toLowerCase();

  const matchesSearch =
    project.title?.toLowerCase().includes(searchTerm) ||
    project.subtitle?.toLowerCase().includes(searchTerm);

  const matchesCategory =
    categoryFilter === "All" ||
    project.category === categoryFilter;

  const matchesStatus =
    statusFilter === "All" ||
    project.status === statusFilter;

  const matchesFeatured =
    featuredFilter === "All" ||
    (featuredFilter === "Featured" && project.featured) ||
    (featuredFilter === "Not Featured" && !project.featured);

  return (
    matchesSearch &&
    matchesCategory &&
    matchesStatus &&
    matchesFeatured
  );
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

const totalPages = Math.ceil(
  sortedProjects.length / projectsPerPage
);

const startIndex = (currentPage - 1) * projectsPerPage;

const paginatedProjects = sortedProjects.slice(
  startIndex,
  startIndex + projectsPerPage
);
useEffect(() => {
  setCurrentPage(1);
}, [search,
  categoryFilter,
  statusFilter,
  featuredFilter,
  sortBy,]);



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
      <div className= "flex flex-wrap gap-4">
        <input
  type="text"
  placeholder="Search projects..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-indigo-500"
/>
<select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
>
  <option value="All">All Categories</option>
  <option value="Portfolio">Portfolio</option>
  <option value="Web App">Web App</option>
  <option value="Desktop App">Desktop App</option>
  <option value="Mobile App">Mobile App</option>
  <option value="API">API</option>
  <option value="AI">AI</option>
  <option value="Other">Other</option>
</select>

<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
>
  <option value="All">All Status</option>
  <option value="Completed">Completed</option>
  <option value="In Progress">In Progress</option>
  <option value="Archived">Archived</option>
</select>

<select
  value={featuredFilter}
  onChange={(e) => setFeaturedFilter(e.target.value)}
  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
>
  <option value="All">All Projects</option>
  <option value="Featured">Featured Only</option>
  <option value="Not Featured">Not Featured</option>
</select>

<select
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
</select>
      </div>
      

      {/* Table */}

      <ProjectTable
        projects={paginatedProjects}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <div className="flex items-center justify-between">
  <button
    onClick={() => setCurrentPage((prev) => prev - 1)}
    disabled={currentPage === 1}
    className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-white/70">
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={() => setCurrentPage((prev) => prev + 1)}
    disabled={currentPage === totalPages || totalPages === 0}
    className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-50"
  >
    Next
  </button>
</div>

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