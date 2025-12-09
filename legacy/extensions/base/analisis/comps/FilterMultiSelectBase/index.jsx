import { Field, Typography } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useEffect, useState } from "react";

function FilterMultiSelectBase({ id, ApiName, ApiSelect, ApiKey, ApiKeyValue, ApiFilterKey, ...props }) {
  if (!ApiName || !ApiSelect || !ApiKey || !ApiKeyValue) {
    return <>No valido, faltan parametros</>
  }
  const [_, dispatch] = useStateValue();

  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);

  const handleChange = event => {
    const valueOption = event.target?.value?.option;
    const valueVal = event.target?.value?.value;
    const valueKey = event.target?.value?.key;
    setValue(null);
    dispatch({
      type: `on${ApiFilterKey}FilterChange`,
      payload: {
        name: ApiName,
        option: {
          "index": valueKey,
          "value": valueVal
        }
      },
    })
  };

  const getOptions = useCallback((text, key) => {
    API(ApiName)
      .get()
      .select(ApiSelect)
      .filter(key ? [ApiKey, "eq", key] : [ApiKeyValue, "like", text ?? ""])
      // .page({
      //   limit: 10000,
      // })
      .success(response => {
        setOptions(
          response.data
            .map(_apiItem => ({
              key: _apiItem[ApiKey],
              value: `${_apiItem[ApiKeyValue]} (${_apiItem[ApiKey]})`,
              option: _apiItem,
            })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return (
    <Field.Select
      id={id}
      value={value}
      onChange={handleChange}
      getOptions={getOptions}
      options={options}
      {...props}
      async
    />
  );
}

export default FilterMultiSelectBase;
