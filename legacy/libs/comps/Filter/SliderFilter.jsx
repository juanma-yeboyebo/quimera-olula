import { Slider } from "@quimera/thirdparty";
import { useFilterValue } from "quimera/hooks";
import { useEffect, useState } from "react";

function SliderFilter({ id, idMin, idMax, operator, marks, min, max, step, ...props }) {
  const [{ filter, schema }, addFilter, removeFilter] = useFilterValue();
  const [isRangeSlider, setIsRangeSlider] = useState(false);

  useEffect(() => {
    setIsRangeSlider(idMin !== undefined && idMax !== undefined);
  }, []);

  const schemaObj = schema?._get?.();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldSchema = id ? fieldsObj?.[id.replace(/\//g, ".").split(".").pop()] : undefined;
  const fieldSchemaMin = idMin
    ? fieldsObj?.[idMin.replace(/\//g, ".").split(".").pop()]
    : undefined;
  const fieldSchemaMax = idMax
    ? fieldsObj?.[idMax.replace(/\//g, ".").split(".").pop()]
    : undefined;

  const handleChange = (event, newValue) => {
    // const myFilter = { ...filter }
    if (isRangeSlider) {
      setFilterProp(idMin, fieldSchemaMin?._name, "gte", newValue[0]);
      setFilterProp(idMax, fieldSchemaMax?._name, "lte", newValue[1]);
    } else {
      setFilterProp(id, fieldSchema?._name, operator, newValue);
    }
    // setFilter(myFilter)
  };

  const setFilterProp = (id, fieldName, operator, newValue) => {
    if ([null, "", undefined].includes(newValue)) {
      // delete myFilter[id]
      removeFilter(id);
    } else {
      addFilter(id, {
        filter: [fieldName, operator, newValue],
        value: newValue,
      });
      // myFilter[id] = {
      //   filter: [fieldName, operator, newValue],
      //   value: newValue,
      // }
    }
  };

  const filterValue = id => filter?.[id]?.value || 0;

  const value = isRangeSlider ? [filterValue(idMin), filterValue(idMax)] : filterValue(id);

  return (
    <Slider
      style={{ width: "90%" }}
      value={value}
      step={step}
      marks={marks}
      min={min}
      max={max}
      disabled={false}
      onChange={handleChange}
      // ValueLabelComponent={ValueLabelComponent}
      // valueLabelDisplay="on"
      // aria-labelledby="range-slider"
      // getAriaValueText={valueLabelFormat}
      // valueLabelFormat={valueLabelFormat}
      // orientation={orientation}
    />
  );
}

export default SliderFilter;
