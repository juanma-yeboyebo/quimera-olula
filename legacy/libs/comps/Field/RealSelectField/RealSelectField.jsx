import { FormControl, InputLabel, MenuItem, Select } from "@quimera/thirdparty";

function RealSelectField({ id, label, value, onChange, options, ...props }) {
  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        id={id}
        labelId={`${id}-label`}
        value={value ?? options[0]?.key ?? ""}
        label={label}
        onChange={onChange}
        fullWidth
        {...props}
      >
        {options.map(option => (
          <MenuItem key={option.key} value={option.key}>
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default RealSelectField;
