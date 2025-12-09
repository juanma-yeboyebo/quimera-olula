import React, { useCallback, useState } from "react";

import { Box } from "../../";
import BaseField from "../BaseField";
import AutocompleteField from "./AutocompleteField";

function AutocompleteBase({ async = false, id, timeout = 500, minCharacters = 0, getOptions, getOptionLabel, disableClearable, renderOption, value, onChange, options, ...props }) {
  const [timer, setTimer] = useState();

  const updateOptions = useCallback(
    v => {
      if (v.length < minCharacters) {
        return;
      }
      if (getOptions) {
        getOptions(v);
      }
    },
    [getOptions, minCharacters],
  );

  const handleInputChange = useCallback(
    event => {
      if (value) {
        onChange && onChange(null);
      }
      const newval = event.target.value;
      clearTimeout(timer);
      setTimer(setTimeout(() => updateOptions(newval), timeout));
    },
    [updateOptions, onChange, timer, setTimer, timeout, value],
  );

  return (
    <Box width={1}>
      <BaseField
        id={id}
        Component={
          <AutocompleteField
            options={options}
            onInputChange={async ? handleInputChange : null}
            getOptionLabel={getOptionLabel}
            disableClearable={disableClearable}
            renderOption={renderOption}
          />
        }
        value={value}
        onChange={onChange}
        getEventValue={e => e.target?.value?.key ?? null}
        {...props}
      />
    </Box>
  );
}

export default AutocompleteBase;
