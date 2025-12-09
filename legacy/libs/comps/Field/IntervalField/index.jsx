import { useStateValue, util } from "quimera";
import React, { useCallback } from "react";

import IntervalField from "./IntervalField";

function IntervalBase({ id, field, desde, hasta, ...props }) {
  const [state, dispatch] = useStateValue();

  const stateField = field || id;
  const stateValue = util.getStateValue(stateField, state, null);

  const handleChange = useCallback(
    event => {
      dispatch({
        type: `on${util.camelId(id)}Changed`,
        payload: {
          field: util.lastStateField(stateField),
          value: event.target.value,
        },
      });
      dispatch({
        type: `on${util.camelId(desde)}Changed`,
        payload: { field: desde, value: event.desde },
      });
      dispatch({
        type: `on${util.camelId(hasta)}Changed`,
        payload: { field: hasta, value: event.hasta },
      });
    },
    [id, desde, hasta, stateField, dispatch],
  );

  const handleFocus = event => {
    return true;
  };

  const handleBlur = event => {
    return true;
  };

  return (
    <IntervalField
      id={id}
      value={stateValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}

export default IntervalBase;
