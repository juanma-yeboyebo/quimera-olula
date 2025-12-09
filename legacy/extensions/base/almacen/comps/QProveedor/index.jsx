import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

function QProveedor({ seVende = false, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(
    (text, key) => {
      const filtro = key
        ? ["codproveedor", "eq", key]
        : {
          or: [["nombre", "like", text]],
        };

      if (text !== null || key !== null) {
        API("proveedores")
          .get()
          .select("codproveedor,nombre")
          .filter(filtro)
          .success(response =>
            setOptions(
              response.data.map(proveedor => {
                return {
                  key: proveedor.codproveedor,
                  value: proveedor.nombre,
                  option: proveedor,
                };
              }),
            ),
          )
          .error(error => console.log("Error", error))
          .go();
      }
    },
    [seVende],
  );

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Buscar proveedor por nombre"
      async
      {...props}
    />
  );
}

export default QProveedor;
