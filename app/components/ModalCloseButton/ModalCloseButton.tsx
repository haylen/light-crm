type ModalCloseButtonProps = {
  onClose: () => void;
};

export const ModalCloseButton = ({ onClose }: ModalCloseButtonProps) => (
  <label
    className="btn btn-sm btn-circle absolute right-2 top-2"
    onClick={onClose}
  >
    ✕
  </label>
);
