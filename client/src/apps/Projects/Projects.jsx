import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PackageOpen } from "lucide-react";

import PJHeader from "./PJHeader";
import PJFilters from "./PJFilters";
import PJCard from "./PJCard";
import PJListRow from "./PJListRow";
import PJDetailPanel from "./PJDetailPanel";

import { getProjects } from "../../services/projectService";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch Projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();

        const formatted = data.map((project) => ({
          id: project._id,

          title: project.title,

          subtitle: project.subtitle ?? "",

          description: project.description,

          image: project.image ?? "",

          github: project.github ?? "",

          liveDemo: project.liveDemo ?? "",

          tech: project.technologies ?? [],

          category: project.category ?? "portfolio",

          featured: project.featured ?? false,

          stars: project.stars ?? 0,

          status: project.status ?? "Completed",

          createdAt: project.createdAt,
        }));

        setProjects(formatted);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the server. <p>Please try again.</p>");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Dynamic categories
  const categories = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category).filter(Boolean))];

    return [
      { id: "all", label: "All" },
      ...cats.map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, [projects]);
  const techTags = useMemo(() => {
    return [...new Set(projects.flatMap((p) => p.tech))].sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (featuredOnly && !p.featured) return false;

      if (selectedCat !== "all" && p.category !== selectedCat) return false;

      if (
        selectedTags.length > 0 &&
        !selectedTags.every((tag) => p.tech.includes(tag))
      ) {
        return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();

        return (
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [projects, searchQuery, selectedCat, selectedTags, featuredOnly]);

  // Category counts
  const projectCounts = useMemo(() => {
    const counts = {};

    categories.forEach((cat) => {
      counts[cat.id] =
        cat.id === "all"
          ? projects.length
          : projects.filter((p) => p.category === cat.id).length;
    });

    return counts;
  }, [projects, categories]);

  const handleTagToggle = useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject((prev) => (prev?.id === project.id ? null : project));
  }, []);

  const LIST_HEADERS = ["Project", "Category", "Status", "Tech", "Stars", ""];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "white",
        }}
      >
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ef4444",
          fontSize: 15,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "rgba(10,10,20,0.97)",
        overflow: "hidden",
        fontFamily: "var(--font-ui)",
      }}
    >
      <PJHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredProjects.length}
        totalCount={projects.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        featuredOnly={featuredOnly}
        onFeaturedToggle={() => setFeaturedOnly((prev) => !prev)}
      />

      <PJFilters
        categories={categories}
        techTags={techTags}
        selectedCategory={selectedCat}
        onCategoryChange={setSelectedCat}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearTags={() => setSelectedTags([])}
        projectCounts={projectCounts}
        showTags={showTags}
        onToggleTags={() => setShowTags((s) => !s)}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 64,
                  gap: 14,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <PackageOpen size={48} />

                <h3>No Projects Found</h3>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCat("all");
                    setSelectedTags([]);
                  }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: selectedProject
                    ? "repeat(auto-fill,minmax(220px,1fr))"
                    : "repeat(auto-fill,minmax(270px,1fr))",
                  gap: 16,
                  padding: 18,
                  transition: "grid-template-columns .25s",
                }}
              >
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <PJCard
                      key={project.id}
                      project={project}
                      onClick={handleProjectClick}
                      isSelected={selectedProject?.id === project.id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 90px 70px auto 80px 56px",
                    gap: 12,
                    padding: "8px 18px",
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  {LIST_HEADERS.map((label) => (
                    <div key={label}>{label}</div>
                  ))}
                </div>

                <AnimatePresence>
                  {filteredProjects.map((project, index) => (
                    <PJListRow
                      key={project.id}
                      project={project}
                      index={index}
                      onClick={handleProjectClick}
                      isSelected={selectedProject?.id === project.id}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedProject && (
            <PJDetailPanel
              key={selectedProject.id}
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
