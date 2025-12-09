import { FormControlLabel, Switch } from "@quimera/thirdparty";
function SwitchField({ label, value, checked, onChange, ...props }) {
  function handleCheck(event) {
    return onChange({
      target: {
        value: event.target.checked,
        name: event.target.value,
      },
    });
  }

  return (
    <FormControlLabel
      control={<Switch defaultChecked={checked} onChange={handleCheck} value={value} {...props} />}
      label={label}
    />
  );
}

export default SwitchField;
