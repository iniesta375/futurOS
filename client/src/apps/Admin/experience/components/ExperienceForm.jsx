import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import {
  createExperience,
  updateExperience,
} from "../../../../services/experienceService";

import ExperienceBasicInfo from "./ExperienceBasicInfo";
import ExperienceDates from "./ExperienceDates";
import ExperienceTechnologies from "./ExperienceTechnologies";
import ExperienceSettings from "./ExperienceSettings";

import { Button } from "../../ui";

function formatDateForInput(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().split("T")[0];
}

export default function ExperienceForm({
  experience = null,
  onSuccess,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company: experience?.company || "",
    role: experience?.role || "",
    employmentType:
      experience?.employmentType || "Full-time",
    location: experience?.location || "",
    startDate: formatDateForInput(
      experience?.startDate
    ),
    endDate: formatDateForInput(
      experience?.endDate
    ),
    current: experience?.current || false,
    description: experience?.description || "",
    technologies: experience?.technologies || [],
    featured: experience?.featured || false,
    status: experience?.status || "Active",
    order: experience?.order ?? 0,
  });

  function updateField(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validate() {
    if (!formData.company.trim()) {
      toast.error("Company is required.");
      return false;
    }

    if (!formData.role.trim()) {
      toast.error("Role is required.");
      return false;
    }

    if (!formData.startDate) {
      toast.error("Start date is required.");
      return false;
    }

    if (
      !formData.current &&
      !formData.endDate
    ) {
      toast.error(
        "End date is required unless this is a current position."
      );
      return false;
    }

    if (
      formData.endDate &&
      new Date(formData.endDate) <
        new Date(formData.startDate)
    ) {
      toast.error(
        "End date cannot be before start date."
      );
      return false;
    }

    if (Number(formData.order) < 0) {
      toast.error(
        "Display order cannot be negative."
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

      const payload = {
        company: formData.company.trim(),
        role: formData.role.trim(),
        employmentType: formData.employmentType,
        location: formData.location.trim(),
        startDate: formData.startDate,
        endDate: formData.current
          ? null
          : formData.endDate || null,
        current: Boolean(formData.current),
        description: formData.description.trim(),
        technologies: Array.isArray(
          formData.technologies
        )
          ? formData.technologies
          : [],
        featured: Boolean(formData.featured),
        status: formData.status,
        order: Number(formData.order),
      };

      if (experience) {
        await updateExperience(
          experience._id,
          payload
        );

        toast.success(
          "Experience updated successfully."
        );
      } else {
        await createExperience(payload);

        toast.success(
          "Experience created successfully."
        );
      }

      // Tell the parent to refresh the experience list
      // and close the modal.
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      console.error(
        "Failed to save experience:",
        err
      );

      toast.error(
        err?.message ||
          "Something went wrong while saving the experience."
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
              Saving experience...
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        {/* Main */}
        <div className="space-y-8">
          <ExperienceBasicInfo
            formData={formData}
            updateField={updateField}
            loading={loading}
          />

          <ExperienceDates
            formData={formData}
            updateField={updateField}
            loading={loading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <ExperienceTechnologies
            technologies={formData.technologies}
            updateField={updateField}
            loading={loading}
          />

          <ExperienceSettings
            formData={formData}
            updateField={updateField}
            loading={loading}
          />
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4 border-t border-white/10 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={loading}
          loadingText={
            experience
              ? "Updating..."
              : "Creating..."
          }
        >
          {experience
            ? "Update Experience"
            : "Create Experience"}
        </Button>
      </div>
    </form>
  );
}