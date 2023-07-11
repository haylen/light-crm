import { Slash } from 'react-feather';

export const NoRecordsPlaceholder = () => (
  <div className="card h-60 bg-base-100 text-base-content opacity-60">
    <div className="card-body items-center justify-center flex-col">
      <Slash size={96} />
      <h2 className="card-title mt-4">No records</h2>
    </div>
  </div>
);
