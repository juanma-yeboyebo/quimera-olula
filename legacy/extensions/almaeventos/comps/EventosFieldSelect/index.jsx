import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function EventosFieldSelect({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const texto = text ?? "";

    const filtroBase = ["codfamilia", "eq", "EVEN"];

    API("articulos")
      .get()
      .select("referencia,descripcion")
      .filter(filtroBase)
      .order("descripcion ASC")
      .page({ limit: 100 })
      .success(response => {
        setOptions(
          response.data.map(articulo => ({
            key: articulo.referencia,
            value: `${articulo.descripcion}`,
            option: articulo,
          })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, []);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Tipo evento"
      {...props}
      async
    />
  );
}

export default EventosFieldSelect;
