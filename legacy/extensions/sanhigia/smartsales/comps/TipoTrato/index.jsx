import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function TipoTrato({ estatico, schema, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback(() => {
    API("ss_tipostrato")
      .get()
      .select("idtipotrato,tipo")
      .success(response =>
        setOptions(
          response.data.map(_tipotrato => ({
            key: _tipotrato.idtipotrato,
            value: _tipotrato.tipo,
            option: _tipotrato,
          })),
        ),
      )
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return estatico ? (
    <Estatico {...props} />
  ) : schema ? (
    <Field.Schema getOptions={getOptions} options={options} schema={schema} {...props} async />
  ) : (
    <Field.Select getOptions={getOptions} options={options} {...props} async />
  );
}

export default TipoTrato;
