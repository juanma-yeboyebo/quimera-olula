import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function Familia({ estatico, filtroFamilias = null, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback(() => {
    const filtro = filtroFamilias ? filtroFamilias : ["1", "eq", "1"];
    API("familias")
      .get()
      .select("codfamilia,descripcion")
      .filter(filtro)
      .success(response =>
        setOptions(
          response.data.map(familia => {
            return { key: familia.codfamilia, value: familia.descripcion, option: familia };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .page({
        limit: 10000,
      })
      .go();
  }, [filtroFamilias]);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  return estatico ? (
    <Estatico {...props} />
  ) : (
    <Field.Select options={options} {...props} noOptionsText="Indica el nombre de la familia" />
  );
}

export default Familia;
