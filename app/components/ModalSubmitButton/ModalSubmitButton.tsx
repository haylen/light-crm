type ModalSubmitButtonProps = {
  isDisabled: boolean;
  isSubmitting: boolean;
  label: string;
};

export const ModalSubmitButton = ({
  isDisabled,
  isSubmitting,
  label,
}: ModalSubmitButtonProps) => (
  <div className="modal-action">
    <button disabled={isDisabled} className="btn btn-block">
      {isSubmitting ? <span className="loading loading-spinner" /> : label}
    </button>
  </div>
);
