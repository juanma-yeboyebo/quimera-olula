import { Field, Typography } from "@quimera/comps";
import { useFilterValue, useStateValue, util } from "quimera";
import { useState } from "react";

function FIltroEstadosTarea({ id, estado, estatico, options, filterField = false, refrescar = false, StaticComp, ...props }) {
  const [state] = useStateValue();
  const filterValueObj = useFilterValue();
  const filterState = filterValueObj?.[0];
  const addFilter = filterValueObj?.[1];
  const removeFilter = filterValueObj?.[2];
  const filter = filterState?.filter;

  const schemaName = util.lastStateField(id).split(".").pop();

  const completada = filterField ? filter?.[schemaName]?.value : util.getStateValue(id, state, null);

  const handleFilter = event => {
    const valueKey = event.target?.value?.key;
    addFilter(id, {
      filter: [schemaName, "eq", valueKey],
      value: valueKey,
    })
  };

  const onChange = filterField ? handleFilter : null;

  if (estatico) {
    if (StaticComp) {
      return <StaticComp>{nombre}</StaticComp>;
    }

    return <Typography>{nombre}</Typography>;
  }

  return (
    <Field.Select
      id={id}
      value={completada}
      onChange={onChange}
      options={options}
      {...props}
      async
    />
  );
}

export default FIltroEstadosTarea;
