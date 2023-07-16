import clsx from 'clsx';
import React, { useState } from 'react';
import { Country } from '~/utils/consts/countries';

type CountryAutocompleteDropdownProps = {
  label: string;
  placeholder: string;
  inputName: string;
  selectedItem: string | undefined;
  errorMessage?: string;
  onChange(selectedItem: string | undefined): void;
};

export const CountryAutocompleteDropdown = ({
  label,
  placeholder,
  inputName,
  selectedItem,
  errorMessage,
  onChange,
}: CountryAutocompleteDropdownProps) => {
  const [inputValue, setInputValue] = useState(
    selectedItem ? selectedItem?.toString() : '',
  );

  const filteredItems = inputValue
    ? Object.values(Country).filter((item) =>
        item.startsWith(inputValue.toUpperCase()),
      )
    : Object.values(Country);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value || undefined);
    setInputValue(e.target.value);
  };

  const getOnItemClickHandler = (item: Country) => () => {
    setInputValue(item);
    onChange(item);

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
          onChange={handleInputChange}
          placeholder={placeholder}
          className={clsx(
            'input input-bordered w-full',
            errorMessage && 'input-error',
          )}
        />
      </div>

      <div className="h-36 w-full mt-2 dropdown-content overflow-auto rounded-md">
        <ul className="menu menu-compact bg-base-200 rounded-md">
          {filteredItems.map((item) => (
            <li
              key={item}
              onClick={getOnItemClickHandler(item)}
              className="w-full"
            >
              <button type="button">{item}</button>
            </li>
          ))}
        </ul>
      </div>

      <p className="h-4 mt-2 pl-1 text-error text-xs">{errorMessage}</p>
    </div>
  );
};
