import { FolderKanban } from "lucide-react";

import Modal from "../../ui/Modal";
import ProjectForm from "./ProjectForm";

export default function ProjectModal({
  project,
  close,
  refresh,
}) {
  const editing = Boolean(project);

  return (
    <Modal
      open
      onClose={close}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-indigo-500/15
              text-indigo-400
            "
          >
            <FolderKanban size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {editing ? "Edit Project" : "Create New Project"}
            </h2>

            <p className="mt-1 text-sm text-white/50">
              {editing
                ? "Update your portfolio project details."
                : "Add a new project to your portfolio."}
            </p>
          </div>
        </div>
      }
    >
      <ProjectForm
        project={project}
        refresh={refresh}
        close={close}
      />
    </Modal>
  );
}