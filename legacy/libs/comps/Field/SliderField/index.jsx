import { Slider } from "@quimera/thirdparty";

// import { util, useStateValue } from 'quimera'
import { Box, Typography } from "../..";
import BaseField from "../BaseField";

const defaultMarks = (min, max, step) => {
  const diff = (max - min) / 5;
  const decimals = step.toString().split(".")?.[1]?.length ?? 0;
  const tenPower = 10 ** decimals;
  const stepMark = Math.round((diff + Number.EPSILON) * tenPower) / tenPower;

  return new Array(6).fill(null).map((_item, idx) => ({
    value: min + idx * stepMark,
    label: (min + idx * stepMark).toFixed(decimals),
  }));
};

function SliderWrapper({ onChange, ...props }) {
  const handleChange = (_event, newValue) => onChange({ target: { value: newValue } });

  return <Slider onChange={handleChange} {...props} />;
}

function SliderField({ label, step = 0.25, marks, min = 0, max = 1, ...props }) {
  return (
    <Box style={{ marginTop: "15px" }}>
      <Typography variant="overline">{label}</Typography>
      <BaseField
        Component={
          <SliderWrapper
            style={{ width: "90%", marginLeft: "5%", alignSelf: "center" }}
            step={step}
            marks={marks ?? defaultMarks(min, max, step)}
            min={min}
            max={max}
          />
        }
        {...props}
      />
    </Box>
  );
}

export default SliderField;
