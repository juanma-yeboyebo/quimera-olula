import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

import schemas from "./schemas";

function Almacen({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const schema = schemas.almacen;

    API("almacenes")
      .get()
      .select("codalmacen,nombre")
      .filter(key ? ["codalmacen", "eq", key] : ["nombre", "like", text])
      .success(response => {
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(almacen => ({
              key: almacen.codAlmacen,
              value: almacen.nombre,
              option: almacen,
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
      noOptionsText="Indica el nombre del almacén"
      {...props}
      async
    />
  );
}

export default Almacen;
