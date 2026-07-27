import Modal from "../../ui/Modal";

import ProjectForm from "./ProjectForm";

export default function ProjectModal({
  project,

  close,

   refresh,
}) {
  return (
    <Modal
      open
      title={project ? "Edit Project" : "Create Project"}
      onClose={close}
    >
      <ProjectForm project={project} refresh={refresh} close={close} />
    </Modal>
  );
}
