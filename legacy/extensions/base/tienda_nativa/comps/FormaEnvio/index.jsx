import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function FormaEnvio({ id, estatico, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("to_formasenvio")
      .get()
      .select("codenvio,descripcion")
      .filter(["1", "eq", "1"])
      .success(response =>
        setOptions(
          response.data.map(formaEnvio => {
            return {
              key: formaEnvio.codenvio,
              value: formaEnvio.descripcion,
              option: formaEnvio,
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
    <Estatico id={id} {...props} />
  ) : (
    <Field.Select id={id} options={options} {...props} noOptionsText="Indica la forma de envío" />
  );
}

export default FormaEnvio;
