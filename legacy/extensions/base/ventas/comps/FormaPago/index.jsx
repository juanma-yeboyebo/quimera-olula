import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function FormaPago({ id, estatico, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    API("formaspago")
      .get()
      .select("codpago,descripcion")
      .filter(["1", "eq", "1"])
      .success(response =>
        setOptions(
          response.data.map(formaPago => {
            return {
              key: formaPago.codpago,
              value: formaPago.descripcion,
              option: formaPago,
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
    <Field.Select id={id} options={options} {...props} noOptionsText="Indica la forma de pago" />
  );
}

export default FormaPago;
