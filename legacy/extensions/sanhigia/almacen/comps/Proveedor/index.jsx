import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";
// import { useFilterValue } from "quimera/hooks";
import { useFilterValue, useStateValue, util } from "quimera";

import schemas from "./schemas";

function Proveedor({ filterField = false, idFilter = false, ...props }) {
  const [state] = useStateValue();
  const [options, setOptions] = useState([]);

  const [{ filter, schema }, addFilter, removeFilter] = useFilterValue();
  // const schemaName = util.lastStateField("codproveedor").split(".").pop();
  const getOptions = useCallback((text, key) => {
    const schema = schemas.proveedor;

    API("proveedores")
      .get()
      .select("codproveedor,nombre,cifnif")
      .filter(key ? ["codproveedor", "eq", key] : ["nombre", "like", text])
      .success(response => {
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(proveedor => ({
              key: proveedor.codProveedor,
              value: proveedor.nombre,
              option: proveedor,
            })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);
  let proveedor = null;
  if (filterField) {
    const filtroGuardado = util.getLastFilter(util.camelId(idFilter));
    proveedor = filter?.["codproveedor"]?.value || filtroGuardado?.["codproveedor"]?.value;
  } else {
    proveedor = util.getStateValue("codproveedor", state, null);

  }

  const handleChange = event => {
    if (filterField) {
      if (event.target.value) {
        addFilter("codproveedor", {
          filter: ["codproveedor", "eq", event.target.value.key],
          value: event.target.value.key
        });
      } else {
        removeFilter(id);
      }
    }
  };

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      value={proveedor}
      onChange={handleChange}
      noOptionsText="Indica el nombre del proveedor"
      {...props}
      async
    />
  );
}

export default Proveedor;
