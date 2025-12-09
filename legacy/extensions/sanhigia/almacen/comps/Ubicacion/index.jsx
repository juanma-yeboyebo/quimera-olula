import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import schemas from "./schemas";

function Ubicacion({ value, ubicaciones, id, index, codUbicacion = "", ...props }) {
  // const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const schema = schemas.ubicacion;

    API("sh_ubicaciones")
      .get()
      .select("codubicacion")
      .filter(key ? ["codubicacion", "eq", key] : ["codubicacion", "like", text])
      // .filter(["codubicacion", "eq", key])
      .success(response => {
        setOptions(
          response.data
            .map(c => schema.load(c))
            .map(ubicacion => ({
              key: ubicacion.codUbicacion,
              value: ubicacion.codUbicacion,
              option: ubicacion,
            })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  // useEffect(() => {
  //   // para la primera vez
  //   console.log("para la primera vez");
  //   getOptions("");
  // }, [codUbicacion]);

  return (
    <Field.Select
      // getOptions={getOptions}
      options={ubicaciones}
      id={id}
      index={index}
      value={value}
      translateOptions={false}
      noOptionsText="Indica el código de ubicación"
      {...props}
      async
    />
  );
}

export default Ubicacion;
