import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

import schemas from "./schemas";

function Proveedor({ ...props }) {
  const [options, setOptions] = useState([]);

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
