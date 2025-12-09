import { Field } from "@quimera/comps";
// import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

function Articulo({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    API("articulos")
      .get()
      .select("referencia,descripcion")
      .filter(
        key
          ? ["referencia", "eq", key]
          : {
            or: [
              ["referencia", "like", text ?? ""],
              ["descripcion", "like", text ?? ""],
            ],
          },
      )
      .success(response =>
        setOptions(
          response.data.map(articulo => ({
            key: articulo.referencia,
            value: articulo.descripcion,
            option: articulo,
          })),
        ),
      )
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Buscar artículo..."
      {...props}
      async
    />
  );
}

export default Articulo;
