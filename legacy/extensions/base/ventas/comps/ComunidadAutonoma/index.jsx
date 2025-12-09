import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function ComunidadAutonoma({ estatico, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("comunidadesautonomas")
      .get()
      .select("id,nombre,codcomunidad")
      .filter(["1", "eq", "1"])
      .success(response =>
        setOptions(
          response.data.map(comunidad => {
            return {
              key: comunidad.id,
              value: comunidad.nombre,
              option: comunidad,
            };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .page({
        limit: 10000,
      })
      .go();
  }, []);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return estatico ? (
    <Estatico {...props} />
  ) : (
    <Field.Select options={options} {...props} noOptionsText="Indica el nombre de la comunidad" />
  );
}

export default ComunidadAutonoma;
