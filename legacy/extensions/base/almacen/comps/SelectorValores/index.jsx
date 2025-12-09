import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import * as React from "react";

const useStyles = makeStyles(theme => ({
  optionsPaper: {
    maxHeight: "50%",
  },
}));

function SelectorValores({ arrayKeyValue = false, callbackChanged, desactivar, fullWidth = false, id, index, label = "", stateField, valores = null, value = null, variant, disabled = false, ...props }) {
  const [_, dispatch] = useStateValue();
  // const [value, setValue] = React.useState(value);
  const classes = useStyles();

  const handleChange = event => {
    // setValue(event.target.value);

    callbackChanged
      ? callbackChanged(event.target.value)
      : dispatch({
        type: `on${util.camelId(id)}Changed`,
        payload: { index, field: stateField || id, value: event.target.value },
      });
    desactivar && desactivar();
  };

  return (
    <Box width={"99%"}>
      <FormControl fullWidth={fullWidth} size="small" disabled={disabled}>
        <InputLabel id="inpuLabel">{label}</InputLabel>
        <Select
          labelId="labelId"
          id={id}
          value={value}
          label={label}
          onChange={handleChange}
          variant={variant}
          MenuProps={{ classes: { paper: classes.optionsPaper } }}
        >
          {!arrayKeyValue && valores.map(valor => <MenuItem value={valor}>{valor}</MenuItem>)}
          {arrayKeyValue &&
            valores.map(valor => <MenuItem value={valor?.key}>{valor?.value}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}

export default SelectorValores;
