import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getSkills,
  deleteSkill,
  archiveSkill,
} from "../../../services/skillsService";

import ConfirmDialog from "../ui/ConfirmDialog";

import {
  SkillToolbar,
  SkillTable,
  SkillModal,
  SkillForm,
  SkillBulkActions,
} from "../skills/components";

export default function Skills() {
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingSkill, setEditingSkill] = useState(null);

  const [selectedSkills, setSelectedSkills] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [featured, setFeatured] = useState("All");

  const [sortBy, setSortBy] = useState("newest");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [skillToDelete, setSkillToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 8;

  async function fetchSkills() {
    try {
      setLoading(true);

      const data = await getSkills();

      setSkills(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    let result = [...skills];

    if (search.trim()) {
      result = result.filter((skill) =>
        skill.name
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      result = result.filter(
        (skill) => skill.category === category,
      );
    }

    if (featured === "Featured") {
      result = result.filter(
        (skill) => skill.featured,
      );
    }

    if (featured === "Not Featured") {
      result = result.filter(
        (skill) => !skill.featured,
      );
    }

    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt),
        );
        break;

      case "az":
        result.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        break;

      case "za":
        result.sort((a, b) =>
          b.name.localeCompare(a.name),
        );
        break;

      case "highest":
        result.sort(
          (a, b) =>
            b.proficiency - a.proficiency,
        );
        break;

      case "lowest":
        result.sort(
          (a, b) =>
            a.proficiency - b.proficiency,
        );
        break;

      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt),
        );
    }

    return result;
  }, [
    skills,
    search,
    category,
    featured,
    sortBy,
  ]);

  const totalPages = Math.ceil(
    filteredSkills.length / PAGE_SIZE,
  );

  const paginatedSkills = filteredSkills.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function openCreateModal() {
    setEditingSkill(null);
    setModalOpen(true);
  }

  function openEditModal(skill) {
    setEditingSkill(skill);
    setModalOpen(true);
  }

  function closeModal() {
    setEditingSkill(null);
    setModalOpen(false);
  }

  function handleDelete(id) {
    const skill = skills.find(
      (item) => item._id === id,
    );

    if (!skill) return;

    setSkillToDelete(skill);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!skillToDelete) return;

    try {
      setDeleting(true);

      await deleteSkill(skillToDelete._id);

      toast.success(
        "Skill deleted successfully.",
      );

      await fetchSkills();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setSkillToDelete(null);
    }
  }

  async function confirmBulkDelete() {
    try {
      await Promise.all(
        selectedSkills.map((id) =>
          deleteSkill(id),
        ),
      );

      toast.success(
        `${selectedSkills.length} skill(s) deleted.`,
      );

      clearSelection();

      await fetchSkills();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBulkDeleteOpen(false);
    }
  }

  function toggleSkillSelection(id) {
    setSelectedSkills((prev) =>
      prev.includes(id)
        ? prev.filter(
            (skillId) => skillId !== id,
          )
        : [...prev, id],
    );
  }

  function toggleSelectAll() {
    if (
      selectedSkills.length ===
      paginatedSkills.length
    ) {
      setSelectedSkills([]);

      return;
    }

    setSelectedSkills(
      paginatedSkills.map(
        (skill) => skill._id,
      ),
    );
  }

  function clearSelection() {
    setSelectedSkills([]);
  }

  async function deleteSelected() {
    if (selectedSkills.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedSkills.length} selected skill(s)?`,
    );

    if (!confirmed) return;

    try {
      await Promise.all(
        selectedSkills.map((id) =>
          deleteSkill(id),
        ),
      );

      toast.success(
        `${selectedSkills.length} skill(s) deleted.`,
      );

      clearSelection();

      await fetchSkills();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function featureSelected() {
    setSkills((prev) =>
      prev.map((skill) =>
        selectedSkills.includes(skill._id)
          ? {
              ...skill,
              featured: true,
            }
          : skill,
      ),
    );

    toast.success(
      "Selected skills featured.",
    );

    clearSelection();
  }

  function unfeatureSelected() {
    setSkills((prev) =>
      prev.map((skill) =>
        selectedSkills.includes(skill._id)
          ? {
              ...skill,
              featured: false,
            }
          : skill,
      ),
    );

    toast.success(
      "Selected skills unfeatured.",
    );

    clearSelection();
  }

  async function archiveSelected() {
    if (selectedSkills.length === 0) {
      toast.info(
        "Select at least one skill.",
      );

      return;
    }

    try {
      await Promise.all(
        selectedSkills.map((id) =>
          archiveSkill(id),
        ),
      );

      toast.success(
        "Selected skills archived.",
      );

      clearSelection();

      await fetchSkills();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-8">
      <SkillToolbar
        skills={skills}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        featured={featured}
        setFeatured={setFeatured}
        onAddSkill={openCreateModal}
      />

      <SkillBulkActions
        selectedCount={selectedSkills.length}
        onFeature={featureSelected}
        onUnfeature={unfeatureSelected}
        onArchive={archiveSelected}
        onDelete={deleteSelected}
        onClear={clearSelection}
      />

      <SkillTable
        skills={paginatedSkills}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        selectedSkills={selectedSkills}
        toggleSkillSelection={
          toggleSkillSelection
        }
        toggleSelectAll={toggleSelectAll}
      />

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-xl border border-white/10 px-4 py-2 disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1,
              )
            }
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
                className={`rounded-xl px-4 py-2 transition ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "border border-white/10 hover:bg-white/5"
                }`}
              >
                {index + 1}
              </button>
            ),
          )}

          <button
            className="rounded-xl border border-white/10 px-4 py-2 disabled:opacity-40"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1,
              )
            }
          >
            Next
          </button>
        </div>
      )}

      <SkillModal
        open={modalOpen}
        title={
          editingSkill
            ? "Edit Skill"
            : "Create Skill"
        }
        onClose={closeModal}
      >
        <SkillForm
          skill={editingSkill}
          refresh={fetchSkills}
          close={closeModal}
        />
      </SkillModal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Skill"
        message={
          skillToDelete
            ? `Are you sure you want to delete "${skillToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSkillToDelete(null);
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title="Delete Selected Skills"
        message={`Are you sure you want to delete ${selectedSkills.length} selected skill(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        onConfirm={confirmBulkDelete}
        onCancel={() =>
          setBulkDeleteOpen(false)
        }
      />
    </div>
  );
}