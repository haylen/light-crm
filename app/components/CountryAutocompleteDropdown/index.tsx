import React, { useState } from 'react';
import { AutocompleteDropdown } from '~/components/AutocompleteDropdown';
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

  const handleItemSelect = (value: string) => {
    setInputValue(value);
    onChange(value);
  };

  return (
    <AutocompleteDropdown
      label={label}
      placeholder={placeholder}
      inputName={inputName}
      inputValue={inputValue}
      items={filteredItems.map((item) => ({ key: item, value: item }))}
      errorMessage={errorMessage}
      onInputChange={handleInputChange}
      onItemSelect={handleItemSelect}
    />
  );
};
