import Modal from "../../ui/Modal";

export default function ExperienceModal({
  open,
  title,
  children,
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={title}
      size="xl"
      onClose={onClose}
    >
      {children}
    </Modal>
  );
}