import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getArchivedSkills, restoreSkill, deleteSkill } from "../../../services/skillsService";

import ArchivedSkillTable from "../skills/components/ArchivedSkillTable";

export default function ArchivedSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSkills() {
    try {
      setLoading(true);

      const data = await getArchivedSkills();

      setSkills(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(id) {
  try {
    await restoreSkill(id);

    toast.success("Skill restored successfully.");

    fetchSkills();
  } catch (err) {
    toast.error(err.message);
  }
}

async function handleDelete(id) {
  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this skill? This action cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteSkill(id);

    toast.success("Skill deleted permanently.");

    fetchSkills();
  } catch (err) {
    toast.error(err.message);
  }
}
  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Archived Skills
        </h1>

        <p className="mt-2 text-white/60">
          Restore or permanently delete archived skills.
        </p>
      </div>

      <ArchivedSkillTable
        skills={skills}
        loading={loading}
        refresh={fetchSkills}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />
    </div>
  );
}