import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function Serie({ id, field, value, estatico, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("series")
      .get()
      .select("codserie,descripcion")
      .filter(["1", "eq", "1"])
      .success(response =>
        setOptions(
          response.data.map(serie => {
            return { key: serie.codserie, value: serie.descripcion };
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
    <Estatico id={id} {...props} />
  ) : (
    <Field.Select
      id={id}
      options={options}
      {...props}
      noOptionsText="Indica el nombre de la serie"
    />
  );
}

export default Serie;
