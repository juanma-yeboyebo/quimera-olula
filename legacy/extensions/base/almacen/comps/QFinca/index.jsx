import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

function QFinca({ ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback((text, key) => {
    const filtro = key
      ? ["codfinca", "eq", key]
      : {
        or: [["descripcion", "like", text]],
      };

    if (text !== null || key !== null) {
      API("vb_fincas")
        .get()
        .select("codfinca,descripcion,codproveedor")
        .filter(filtro)
        .success(response =>
          setOptions(
            response.data.map(finca => {
              return {
                key: finca.codfinca,
                value: finca.descripcion,
                option: finca,
              };
            }),
          ),
        )
        .error(error => console.log("Error", error))
        .go();
    }
  }, []);

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

export default QFinca;
