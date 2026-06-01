import Modal from "./Modal";
import Button from "./Button";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="p-6">
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          size="sm"
          variant={variant === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Please wait..." : confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
