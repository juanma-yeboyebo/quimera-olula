import { Field, Typography } from "@quimera/comps";
import { getSchemas, useFilterValue, useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useEffect, useState } from "react";

function AgenteSmartsales({ id, estatico, StaticComp, filterField = false, ...props }) {
  const [state] = useStateValue();
  const filterValueObj = useFilterValue();
  // const [filterValueObj, addFilter] = useFilterValue();
  const filterState = filterValueObj?.[0];
  const addFilter = filterValueObj?.[1];
  const removeFilter = filterValueObj?.[2];
  const filter = filterState?.filter;

  const [nombre, setNombre] = useState("");
  const [options, setOptions] = useState([]);

  const schemaName = util.lastStateField(id).split(".").pop();

  const agente = filterField ? filter?.[schemaName]?.value : util.getStateValue(id, state, null);

  const handleFilter = event => {
    const valueKey = event.target?.value?.key;
    valueKey
      ? addFilter(id, {
        filter: [schemaName, "eq", valueKey],
        value: valueKey,
      })
      : removeFilter(id);
  };

  const onChange = filterField ? handleFilter : null;

  useEffect(() => {
    API("agentes")
      .get()
      .select("codagente,nombreap")
      .filter(["codagente", "eq", agente])
      .success(response => setNombre(response.data[0]?.nombreap))
      .error(error => console.log("Error", error))
      .go();
  }, [agente]);

  if (estatico) {
    if (StaticComp) {
      return <StaticComp>{nombre}</StaticComp>;
    }

    return <Typography>{nombre}</Typography>;
  }

  const getOptions = useCallback((text, key) => {
    const schema = getSchemas().agente;

    API("agentes")
      .get()
      .select("codagente,nombreap")
      .filter(key ? ["codagente", "eq", key] : ["nombreap", "like", text ?? ""])
      .page({
        limit: 10000,
      })
      .success(response => {
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(_agente => ({
              key: _agente.codAgente,
              value: _agente.nombreap,
              option: _agente,
            })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return (
    <Field.Select
      id={id}
      value={agente}
      onChange={onChange}
      getOptions={getOptions}
      options={options}
      {...props}
      async
    />
  );
}

export default AgenteSmartsales;
