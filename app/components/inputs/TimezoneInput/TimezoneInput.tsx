import clsx from 'clsx';
import { TIMEZONE_SELECT_OPTIONS } from '~/utils/consts/time';

const EMPTY_PLACEHOLDER = '-';

type TimezoneInputProps = {
  name: string;
  value: number | undefined;
  isDisabled?: boolean;
  onChange: (value: number) => void;
};

const getFormattedDisplayValue = (value: number | undefined) => {
  if (!Number.isInteger(value)) return EMPTY_PLACEHOLDER;

  return TIMEZONE_SELECT_OPTIONS.find((option) => option.value === value)
    ?.label;
};

export const TimezoneInput = ({
  name,
  value,
  isDisabled,
  onChange,
}: TimezoneInputProps) => (
  <div className="dropdown">
    <label
      tabIndex={0}
      className={clsx(
        'w-28 btn btn-ghost whitespace-nowrap',
        isDisabled && 'btn-disabled',
      )}
    >
      {getFormattedDisplayValue(value)}
    </label>
    <div className="h-36 w-32 mt-2 dropdown-content overflow-auto rounded-md z-10">
      <ul className="menu menu-compact bg-base-200 rounded-md">
        {TIMEZONE_SELECT_OPTIONS.map(({ label, value }) => (
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
    <input type="hidden" name={name} value={value} />
  </div>
);
