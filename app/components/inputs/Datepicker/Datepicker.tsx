import { useState } from 'react';
import { Slash, X } from 'react-feather';
import Datepicker from 'tailwind-datepicker-react';

const DEFAULT_MIN_DATE = new Date('2023-01-01');
const DEFAULT_MAX_DATE = new Date('2040-01-01');
const EMPTY_PLACEHOLDER = '-';

type DatepickerWrapperProps = {
  value: Date | undefined;
  classNames?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: Date | undefined) => void;
};

const prepareDisplayValue = (value: Date | string | undefined) => {
  if (!value) return EMPTY_PLACEHOLDER;

  let date;
  if (typeof value === 'string') {
    date = new Date(value);
  } else {
    date = value;
  }

  return date.toLocaleDateString('en-us', {
    day: 'numeric',
    year: 'numeric',
    month: 'short',
  });
};

const DatepickerWrapper = ({
  value,
  onChange,
  classNames = '',
  minDate = DEFAULT_MIN_DATE,
  maxDate = DEFAULT_MAX_DATE,
}: DatepickerWrapperProps) => {
  const options = {
    autoHide: true,
    clearBtn: false,
    datepickerClassNames: classNames,
    defaultDate: new Date(),
    disabledDates: [],
    inputIdProp: 'date',
    inputNameProp: 'date',
    inputPlaceholderProp: 'Select Date',
    maxDate: maxDate,
    minDate: minDate,
    language: 'en',
    weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    todayBtn: false,
    theme: {
      input: '',
      inputIcon: '',
      todayBtn: '',
      background: '!bg-base-200',
      clearBtn: '!btn focus:ring-0',
      disabledText:
        '!text-neutral/[.5] dark:!text-neutral-content/[.5] !font-normal hover:!bg-base-content/[.1]',
      icons: '!btn focus:ring-0',
      selected: 'bg-primary !text-primary-content',
      text: '!text-base-content !font-normal hover:!bg-base-content/[.1] hover:!text-base-content',
    },
  };

  const [isShown, setIsShown] = useState(false);

  const resetValue = () => onChange(undefined);

  const handleClose = () => setIsShown(false);

  const handleOpen = () => setIsShown(true);

  return (
    <Datepicker
      options={options}
      onChange={onChange}
      show={isShown}
      setShow={handleClose}
    >
      <div className="flex items-center">
        <div className="tooltip" data-tip="Close">
          <button
            type="button"
            className="btn btn-ghost mr-2"
            disabled={!isShown}
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="tooltip" data-tip="Clear value">
          <button
            type="button"
            className="btn btn-ghost mr-2"
            disabled={!value}
            onClick={resetValue}
          >
            <Slash size={20} />
          </button>
        </div>

        <button
          type="button"
          className="w-32 btn btn-ghost font-normal normal-case"
          onClick={handleOpen}
        >
          {prepareDisplayValue(value)}
        </button>
      </div>
    </Datepicker>
  );
};

export { DatepickerWrapper as Datepicker };
