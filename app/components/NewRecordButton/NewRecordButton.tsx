import { Plus } from 'react-feather';

type NewRecordButtonProps = {
  onClick: () => void;
};

export const NewRecordButton = ({ onClick }: NewRecordButtonProps) => (
  <button className="btn btn-circle btn-outline" onClick={onClick}>
    <Plus size={20} />
  </button>
);
