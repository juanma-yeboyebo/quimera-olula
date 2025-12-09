import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function Provincia({ estatico, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("provincias")
      .get()
      .select("idprovincia,provincia")
      .filter(["1", "eq", "1"])
      .success(response =>
        setOptions(
          response.data.map(provincia => {
            return {
              key: provincia.idprovincia,
              value: provincia.provincia,
              option: provincia,
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
    <Field.Select options={options} {...props} noOptionsText="Indica el nombre de la provincia" />
  );
}

export default Provincia;
