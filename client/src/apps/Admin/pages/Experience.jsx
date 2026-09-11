import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getExperiences,
  archiveExperience,
  restoreExperience,
  deleteExperience,
  updateExperience,
} from "../../../services/experienceService";

import ConfirmDialog from "../ui/ConfirmDialog";

import {
  ExperienceToolbar,
  ExperienceTable,
  ExperienceModal,
  ExperienceForm,
  ExperienceBulkActions,
} from "../experience/components";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [selectedExperiences, setSelectedExperiences] = useState([]);

  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState("All");
  const [featured, setFeatured] = useState("All");
  const [status, setStatus] = useState("Active");

  // Single delete dialog
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Single archive dialog
  const [experienceToArchive, setExperienceToArchive] = useState(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  // Bulk delete dialog
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

  /* =========================
     FETCH EXPERIENCES
  ========================= */

  const fetchExperiences = async () => {
    try {
      setLoading(true);

      const data = await getExperiences();

      const experienceList = Array.isArray(data)
        ? data
        : data?.experiences || [];

      setExperiences(experienceList);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);

      toast.error(
        error?.message || "Failed to load experiences."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  /* =========================
     FILTERING
  ========================= */

  const filteredExperiences = useMemo(() => {
    return experiences.filter((experience) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        experience.company?.toLowerCase().includes(searchValue) ||
        experience.role?.toLowerCase().includes(searchValue) ||
        experience.location?.toLowerCase().includes(searchValue);

      const matchesEmploymentType =
        employmentType === "All" ||
        experience.employmentType === employmentType;

      const matchesFeatured =
        featured === "All" ||
        (featured === "Featured" && experience.featured) ||
        (featured === "Not Featured" && !experience.featured);

      const matchesStatus =
        status === "All" ||
        experience.status === status;

      return (
        matchesSearch &&
        matchesEmploymentType &&
        matchesFeatured &&
        matchesStatus
      );
    });
  }, [
    experiences,
    search,
    employmentType,
    featured,
    status,
  ]);

  /* =========================
     MODAL
  ========================= */

  const handleAddExperience = () => {
    setEditingExperience(null);
    setModalOpen(true);
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExperience(null);
  };

  const handleFormSuccess = async () => {
    closeModal();
    await fetchExperiences();
  };

  /* =========================
     SELECTION
  ========================= */

  const toggleExperienceSelection = (id) => {
    setSelectedExperiences((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredExperiences.map(
      (experience) => experience._id
    );

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedExperiences.includes(id)
      );

    if (allSelected) {
      setSelectedExperiences((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedExperiences((prev) => [
        ...new Set([...prev, ...visibleIds]),
      ]);
    }
  };

  const clearSelection = () => {
    setSelectedExperiences([]);
  };

  /* =========================
     SINGLE DELETE
  ========================= */

  const handleDeleteExperience = (experience) => {
    setExperienceToDelete(experience);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete?._id) return;

    try {
      await deleteExperience(experienceToDelete._id);

      setExperiences((prev) =>
        prev.filter(
          (experience) =>
            experience._id !== experienceToDelete._id
        )
      );

      setSelectedExperiences((prev) =>
        prev.filter(
          (id) => id !== experienceToDelete._id
        )
      );

      toast.success("Experience deleted successfully.");

      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
    } catch (error) {
      console.error("Failed to delete experience:", error);

      toast.error(
        error?.message || "Failed to delete experience."
      );
    }
  };

  /* =========================
     ARCHIVE
  ========================= */

  const handleArchiveExperience = (experience) => {
    setExperienceToArchive(experience);
    setArchiveDialogOpen(true);
  };

  const confirmArchive = async () => {
    if (!experienceToArchive?._id) return;

    try {
      await archiveExperience(experienceToArchive._id);

      setExperiences((prev) =>
        prev.map((experience) =>
          experience._id === experienceToArchive._id
            ? { ...experience, status: "Archived" }
            : experience
        )
      );

      toast.success("Experience archived successfully.");

      setArchiveDialogOpen(false);
      setExperienceToArchive(null);
    } catch (error) {
      console.error("Failed to archive experience:", error);

      toast.error(
        error?.message || "Failed to archive experience."
      );
    }
  };

  /* =========================
     RESTORE
  ========================= */

  const handleRestoreExperience = async (experience) => {
    if (!experience?._id) return;

    try {
      await restoreExperience(experience._id);

      setExperiences((prev) =>
        prev.map((item) =>
          item._id === experience._id
            ? { ...item, status: "Active" }
            : item
        )
      );

      toast.success("Experience restored successfully.");
    } catch (error) {
      console.error("Failed to restore experience:", error);

      toast.error(
        error?.message || "Failed to restore experience."
      );
    }
  };

  /* =========================
     BULK FEATURE / UNFEATURE
  ========================= */

  const handleBulkFeature = async (value) => {
    if (!selectedExperiences.length) return;

    try {
      const selectedItems = experiences.filter((experience) =>
        selectedExperiences.includes(experience._id)
      );

      await Promise.all(
        selectedItems.map((experience) =>
          updateExperience(experience._id, {
            company: experience.company,
            role: experience.role,
            employmentType: experience.employmentType,
            location: experience.location,
            startDate: experience.startDate,
            endDate: experience.current
              ? null
              : experience.endDate,
            current: experience.current,
            description: experience.description,
            technologies: experience.technologies,
            featured: value,
            status: experience.status,
            order: experience.order,
          })
        )
      );

      setExperiences((prev) =>
        prev.map((experience) =>
          selectedExperiences.includes(experience._id)
            ? { ...experience, featured: value }
            : experience
        )
      );

      toast.success(
        value
          ? "Selected experiences featured."
          : "Selected experiences unfeatured."
      );

      clearSelection();
    } catch (error) {
      console.error(
        "Failed to update selected experiences:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to update selected experiences."
      );
    }
  };

  /* =========================
     BULK ARCHIVE
  ========================= */

  const handleBulkArchive = async () => {
    if (!selectedExperiences.length) return;

    try {
      await Promise.all(
        selectedExperiences.map((id) =>
          archiveExperience(id)
        )
      );

      setExperiences((prev) =>
        prev.map((experience) =>
          selectedExperiences.includes(experience._id)
            ? { ...experience, status: "Archived" }
            : experience
        )
      );

      toast.success("Selected experiences archived.");

      clearSelection();
    } catch (error) {
      console.error(
        "Failed to archive selected experiences:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to archive selected experiences."
      );
    }
  };

  /* =========================
     BULK DELETE
  ========================= */

  const handleBulkDelete = () => {
    if (!selectedExperiences.length) return;

    setBulkDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!selectedExperiences.length) return;

    try {
      await Promise.all(
        selectedExperiences.map((id) =>
          deleteExperience(id)
        )
      );

      setExperiences((prev) =>
        prev.filter(
          (experience) =>
            !selectedExperiences.includes(experience._id)
        )
      );

      toast.success(
        `${selectedExperiences.length} experience${
          selectedExperiences.length > 1 ? "s" : ""
        } deleted successfully.`
      );

      clearSelection();

      setBulkDialogOpen(false);
    } catch (error) {
      console.error(
        "Failed to delete selected experiences:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to delete selected experiences."
      );
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="space-y-6">
      <ExperienceToolbar
        experiences={experiences}
        search={search}
        setSearch={setSearch}
        employmentType={employmentType}
        setEmploymentType={setEmploymentType}
        featured={featured}
        setFeatured={setFeatured}
        status={status}
        setStatus={setStatus}
        onAddExperience={handleAddExperience}
      />

      {selectedExperiences.length > 0 && (
        <ExperienceBulkActions
          selectedCount={selectedExperiences.length}
          onFeature={() => handleBulkFeature(true)}
          onUnfeature={() => handleBulkFeature(false)}
          onArchive={handleBulkArchive}
          onDelete={handleBulkDelete}
          onClear={clearSelection}
        />
      )}

      <ExperienceTable
        experiences={filteredExperiences}
        loading={loading}
        selectedExperiences={selectedExperiences}
        toggleExperienceSelection={
          toggleExperienceSelection
        }
        toggleSelectAll={toggleSelectAll}
        onEdit={handleEditExperience}
        onDelete={handleDeleteExperience}
        onArchive={handleArchiveExperience}
        onRestore={handleRestoreExperience}
      />

      <ExperienceModal
        open={modalOpen}
        title={
          editingExperience
            ? "Edit Experience"
            : "Add Experience"
        }
        onClose={closeModal}
      >
        <ExperienceForm
          experience={editingExperience}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </ExperienceModal>

      {/* Single Delete */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Experience"
        message={
          experienceToDelete
            ? `Are you sure you want to permanently delete your experience at ${experienceToDelete.company}? This action cannot be undone.`
            : "Are you sure you want to delete this experience?"
        }
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setExperienceToDelete(null);
        }}
      />

      {/* Single Archive */}
      <ConfirmDialog
        open={archiveDialogOpen}
        title="Archive Experience"
        message={
          experienceToArchive
            ? `Are you sure you want to archive your experience at ${experienceToArchive.company}?`
            : "Are you sure you want to archive this experience?"
        }
        confirmText="Archive"
        onConfirm={confirmArchive}
        onCancel={() => {
          setArchiveDialogOpen(false);
          setExperienceToArchive(null);
        }}
      />

      {/* Bulk Delete */}
      <ConfirmDialog
        open={bulkDialogOpen}
        title="Delete Experiences"
        message={`Are you sure you want to permanently delete ${
          selectedExperiences.length
        } selected experience${
          selectedExperiences.length > 1 ? "s" : ""
        }? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmBulkDelete}
        onCancel={() => {
          setBulkDialogOpen(false);
        }}
      />
    </div>
  );
}