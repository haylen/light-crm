import clsx from 'clsx';
import {
  HOURS_SELECT_OPTIONS,
  MINUTES_SELECT_OPTIONS,
} from '~/utils/consts/time';

const EMPTY_PLACEHOLDER = '-';

type TimeParticleProps = {
  isMinutes?: boolean;
  isDisabled?: boolean;
  value: string | undefined;
  onChange: (value: string) => void;
};

const TimeParticle = ({
  isMinutes = false,
  isDisabled = false,
  value,
  onChange,
}: TimeParticleProps) => {
  const selectOptions = isMinutes
    ? MINUTES_SELECT_OPTIONS
    : HOURS_SELECT_OPTIONS;

  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className={clsx(
          'w-14 btn btn-ghost',
          isMinutes ? 'ml-1' : 'mr-1',
          isDisabled && 'btn-disabled',
        )}
      >
        {value || EMPTY_PLACEHOLDER}
      </label>
      <div className="h-36 w-36 mt-2 dropdown-content overflow-auto rounded-md">
        <ul className="menu menu-compact bg-base-200 rounded-md">
          {selectOptions.map(({ label, value }) => (
            <li
              key={value}
              onClick={() => {
                onChange(value);

                /* This is a hack to make the dropdown close when an item is selected */
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
              className="w-full"
            >
              <button type="button">{label}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

type TimeInputProps = {
  name: string;
  value: string | undefined;
  isDisabled?: boolean;
  onChange: (value: string) => void;
};

export const TimeInput = ({
  name,
  value,
  isDisabled,
  onChange,
}: TimeInputProps) => {
  const [hours, minutes] = value ? value.split(':') : [undefined, undefined];

  const handleHoursChange = (value: string) => {
    onChange(value ? `${value}:${minutes || '00'}` : `${value}:00`);
  };

  const handleMinutesChange = (value: string) => {
    onChange(value ? `${hours || '00'}:${value}` : `${value}:00`);
  };

  return (
    <div className="flex items-center">
      <TimeParticle
        value={hours}
        onChange={handleHoursChange}
        isDisabled={isDisabled}
      />
      <span>:</span>
      <TimeParticle
        isMinutes
        value={minutes}
        onChange={handleMinutesChange}
        isDisabled={isDisabled}
      />
      <input type="hidden" name={name} value={value} />
    </div>
  );
};
