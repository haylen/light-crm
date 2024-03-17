import { TIMEZONE_SELECT_OPTIONS } from '~/utils/consts/time';
import { getCurrentTimezone } from '~/utils/dates';

export const CurrentTimezoneLabel = () => {
  const timezone = getCurrentTimezone();
  const label = TIMEZONE_SELECT_OPTIONS.find(
    (option) => option.value === timezone,
  )?.label;

  return (
    <div className="badge badge-accent badge-outline">
      Current timezone: {label}
    </div>
  );
};
