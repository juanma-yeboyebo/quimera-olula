import { util } from "quimera";
import { useCallback, useEffect, useState } from "react";

import { Field } from "../";

function IntervalField({ value, onChange, intervals, ...props }) {
  const [options, setOptions] = useState([]);
  const data = util.intervalosAOpciones(intervals ?? Object.keys(util.intervalos));

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = useCallback((text, key) => {
    let matchedOptions = [...data];

    if (!!text && text !== "") {
      matchedOptions = matchedOptions.filter(item =>
        key
          ? item.key === key
          : item.key.toUpperCase() === text?.toUpperCase() ||
            item.value.toUpperCase().startsWith(text?.toUpperCase()),
      );
    }

    const completeOptions = matchedOptions.map(item => ({
      key: item.key,
      value: item.value,
      option: item,
    }));

    setOptions(completeOptions);
  }, []);

  const handleIntervalChange = useCallback(
    event => {
      const val = event.target.value ?? "";
      const interval = data.filter(item => item.key === val || item.value === val)[0];

      return onChange({
        target: {
          value: val,
        },
        desde: interval.desde(),
        hasta: interval.hasta(),
      });
    },
    [onChange],
  );

  return (
    <Field.RealSelect
      value={value ?? ""}
      onChange={handleIntervalChange}
      options={options}
      fullWidth
      {...props}
    />
  );
}

export default IntervalField;
