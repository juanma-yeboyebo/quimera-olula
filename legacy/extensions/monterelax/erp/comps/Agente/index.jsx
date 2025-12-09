// import { Autocomplete } from '@quimera/thirdparty'
import AutocompleteField from "@quimera/comps/Field/AutocompleteField/AutocompleteField";
import { API, useStateValue, util } from "quimera";
import { useCallback, useEffect, useState } from "react";
// import AutocompleteField from '@quimera/comps/Field/AutocompleteField/AutocompleteField'

function Agente({ id, field, timeout, minCharacters, ...props }) {
  const [state, dispatch] = useStateValue();
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState({});
  const [timer, setTimer] = useState(null);

  const stateField = field || id;
  const stateValue = util.getStateValue(stateField, state, null);

  useEffect(() => {
    if (!stateValue) {
      return;
    }
    API("agentes")
      .get()
      .select("codagente,nombreap")
      .filter(["codagente", "eq", stateValue])
      .success(response =>
        setOptions(
          response.data.map(agente => {
            return { key: agente.codagente, value: agente.nombreap };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .go();
  }, [stateValue]);

  const handleChange = useCallback(
    (event, value) => {
      dispatch({
        type: `on${util.camelId(id)}Changed`,
        payload: { field: stateField, value: value ? value.key || "" : "" },
      });
    },
    [id, stateField, dispatch],
  );

  const handleInputChange = useCallback(
    event => {
      const newval = event.target.value;
      if (stateValue) {
        dispatch({
          type: `on${util.camelId(id)}Changed`,
          payload: { field: stateField, value: "" },
        });
      }
      clearTimeout(timer);
      setTimer(setTimeout(() => handleUpdate(newval), timeout));
    },
    [timer, setTimer, timeout],
  );

  const handleUpdate = useCallback(
    value => {
      if (value.length < minCharacters) {
        return;
      }
      API("agentes")
        .get()
        .select("codagente,nombreap")
        .filter(["nombreap", "like", value])
        .success(response =>
          setOptions(
            response.data.map(agente => {
              return { key: agente.codagente, value: agente.nombreap };
            }),
          ),
        )
        .error(error => console.log("Error", error))
        .go();
    },
    [id],
  );

  const hay = options.filter(o => o.key === stateValue);
  const valor = hay[0];
  if (valor && valor !== value) {
    setValue(valor);
  }

  return (
    <AutocompleteField
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      value={value}
      {...props}
    />
  );
}

export default Agente;
