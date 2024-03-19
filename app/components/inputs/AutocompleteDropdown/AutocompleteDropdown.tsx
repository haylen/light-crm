import clsx from 'clsx';
import React from 'react';

type AutocompleteDropdownProps = {
  label: string;
  placeholder: string;
  inputName: string;
  inputValue: string;
  items: { key: string; value: string }[];
  errorMessage?: string;
  onInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
  onItemSelect(value: string): void;
};

export const AutocompleteDropdown = ({
  label,
  placeholder,
  inputName,
  inputValue,
  items,
  errorMessage,
  onInputChange,
  onItemSelect,
}: AutocompleteDropdownProps) => {
  const getOnItemClickHandler = (item: string) => () => {
    onItemSelect(item);

    /* This is a hack to make the dropdown close when an item is selected */
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="dropdown w-full">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>

        <input
          type="text"
          name={inputName}
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder}
          className={clsx(
            'input input-bordered w-full',
            errorMessage && 'input-error',
          )}
        />
      </div>

      <div className="h-36 w-full mt-2 dropdown-content overflow-auto rounded-md z-10">
        <ul className="menu menu-compact bg-base-200 rounded-md">
          {items.map(({ key, value }) => (
            <li
              key={key}
              onClick={getOnItemClickHandler(value)}
              className="w-full"
            >
              <button type="button">{value}</button>
            </li>
          ))}
        </ul>
      </div>

      <p className="h-4 mt-2 pl-1 text-error text-xs">{errorMessage}</p>
    </div>
  );
};
