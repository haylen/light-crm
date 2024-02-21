import { Form } from '@remix-run/react';
import { Modal } from '~/components/Modal';
import { ActionType } from '~/utils/consts/formActions';

type DeleteItemConfirmationModalProps = {
  itemId: string;
  formError?: string;
  isSubmitting: boolean;
  onClose: () => void;
};

export const DeleteItemConfirmationModal = ({
  itemId,
  formError,
  isSubmitting,
  onClose,
}: DeleteItemConfirmationModalProps) => (
  <Modal>
    <div className="modal modal-open">
      <div className="modal-box">
        <label
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </label>
        <h3 className="font-bold text-lg">Delete confirmation</h3>
        <p className="py-4">Do you really want to delete this item?</p>
        <Form method="post" action={`?/${ActionType.DeleteItemConfirmation}`}>
          <input type="hidden" name="_itemId" value={itemId} />
          <div className="h-8 flex items-center">
            {formError && <p className="text-error text-xs">{formError}</p>}
          </div>
          <div className="modal-action gap-4 justify-between">
            <button
              type="button"
              disabled={isSubmitting}
              className="btn btn-outline flex-1"
              onClick={onClose}
            >
              No
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn flex-1 ${isSubmitting ? 'loading' : ''}`}
            >
              Yes
            </button>
          </div>
        </Form>
      </div>
    </div>
  </Modal>
);
