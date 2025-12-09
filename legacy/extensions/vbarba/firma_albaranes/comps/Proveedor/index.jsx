import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import schemas from "./schemas";

function Proveedor({ transportista = false, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const schema = schemas.proveedores;
    const texto = text ?? "";

    const filtroBase = key
      ? ["codproveedor", "eq", key]
      : {
        or: [
          ["nombre", "like", texto],
          ["aliasprov", "like", texto],
        ],
      };

    const filtro = transportista
      ? {
        and: [["transportista", "eq", true], filtroBase],
      }
      : filtroBase;

    API("proveedores")
      .get()
      .select("codproveedor,aliasprov,nombre")
      .filter(filtro)
      // .filter(key ? ["codproveedor", "eq", key] : ["nombre", "like", texto])
      .order("nombre ASC")
      .page({ limit: 100 })
      .success(response => {
        setOptions(
          response.data
            // .map(p => schema.load(p))
            .map(prov => ({
              key: prov.codproveedor,
              value: prov.nombre,
              option: prov,
            })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, [transportista]);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Indica el nombre del proveedor"
      {...props}
      async
    />
  );
}

export default Proveedor;
