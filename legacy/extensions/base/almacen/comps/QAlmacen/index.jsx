import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

function QAlmacen({ finca = null, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(
    (text, key) => {
      const filtroBase = key
        ? ["codalmacen", "eq", key]
        : {
          or: [["nombre", "like", text]],
        };

      const filtro = finca
        ? {
          and: [["codfinca", "like", finca], filtroBase],
        }
        : filtroBase;

      if (text !== null || key !== null) {
        API("almacenes")
          .get()
          .select("codalmacen,nombre")
          .filter(filtro)
          .success(response =>
            setOptions(
              response.data.map(almacen => {
                return {
                  key: almacen.codalmacen,
                  value: almacen.nombre,
                  option: almacen,
                };
              }),
            ),
          )
          .error(error => console.log("Error", error))
          .go();
      }
    },
    [finca],
  );

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Buscar almacén por nombre"
      async
      {...props}
    />
  );
}

export default QAlmacen;
