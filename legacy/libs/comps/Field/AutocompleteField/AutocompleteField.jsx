import { Autocomplete, TextField } from "@quimera/thirdparty";
import React from "react";

function AutocompleteField({
  options,
  value,
  disabled,
  onInputChange,
  fullWidth,
  InputProps, // Para mantener compatibilidad hacia atrás esta deprecada
  onChange,
  noOptionsText,
  getOptionLabel,
  disableClearable,
  renderOption,
  slotProps,
  ...props
}) {
  const handleChange = (e, value) => onChange({ ...e, target: { ...e.target, value } });

  // Función para comparar opciones
  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;

    // Si value es un objeto con key
    if (value?.key !== undefined) {
      return option.key === value.key;
    }

    // Si value es directamente el key
    return option.key === value;
  };

  // Función para obtener el label
  const getOptionLabelDefault = (option) => {
    if (typeof option === 'string') return option;
    if (getOptionLabel) return getOptionLabel(option);
    return option?.value || option?.key?.toString() || option?.toString() || "";
  };

  return (
    <Autocomplete
      getOptionLabel={getOptionLabelDefault}
      isOptionEqualToValue={isOptionEqualToValue}
      options={options}
      loading={false}
      autoHighlight
      value={value ?? null}
      onChange={handleChange}
      disabled={disabled}
      disableClearable={disableClearable}
      renderOption={(props, option) => (
        <li {...props} key={option.key}>
          {renderOption ? renderOption(option) : getOptionLabelDefault(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          id=""
          disabled={disabled}
          onChange={onInputChange}
          fullWidth={fullWidth}
          margin="dense"
          variant="standard"
          slotProps={{
            input: {
              ...params.InputProps,
              ...InputProps, // Mantenemos compatibilidad hacia atrás
              ...slotProps?.input,
            },
            ...slotProps,
          }}
          {...props}
        />
      )}
      noOptionsText={noOptionsText || ""}
    />
  );
}

export default AutocompleteField;
