import { useStateValue, util } from "quimera";
import React, { useCallback, useEffect, useState } from "react";

import { Field } from "..";

function SelectField({ async, id, index, field, getOptions, onChange, options = [], value, translateOptions = true, ...props }) {
  const [state, dispatch] = useStateValue();
  const [localValue, setLocalValue] = useState(null);

  const stateField = field || id;
  const stateValue = value || util.getStateValue(stateField, state, null);
  const translations = options && {
    ...options,
  };

  const translatedOptions = !translateOptions ? options : options?.map(option => ({
    ...option,
    value: util.translate(option.value),
  }));

  useEffect(() => {
    async && getOptions && stateValue !== (localValue?.key ?? null) && getOptions(null, stateValue);
  }, [async, getOptions, id, localValue, stateValue]);

  const handleChange = useCallback(
    event => {
      const value = event ? event.target.value?.key : null;
      const option = event ? event.target.value?.option : null;

      dispatch({
        type: `on${util.camelId(id)}Changed`,
        payload: { field: util.lastStateField(stateField), value, option, index },
      });
    },
    [dispatch, id, stateField],
  );

  // if ((stateValue ?? null) !== null) {
  //   const valor = options.reduce((acum, o) => o.key === stateValue ? o : acum, null)
  //   valor?.key !== localValue?.key && setLocalValue(valor)
  // }
  // const valor = options.reduce((acum, o) => o.key === stateValue ? o : acum, { key: null, value: ''})
  // valor?.key !== localValue?.key && setLocalValue(valor)

  const valor = options.reduce((acum, o) => (o.key === stateValue ? o : acum), null);
  valor?.key !== localValue?.key && setLocalValue(valor);

  return (
    <Field.Autocomplete
      async={async}
      id={id}
      field={field}
      options={translatedOptions}
      getOptions={getOptions}
      onChange={onChange ?? handleChange}
      value={localValue}
      {...props}
    />
  );
}

export default SelectField;
