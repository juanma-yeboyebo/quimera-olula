import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function Subfamilia({ id, field, value, estatico, codFamilia, global = false, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback(() => {
    if (codFamilia || global) {
      API("subfamilias")
        .get()
        .select("codsubfamilia,descripcion")
        .filter(codFamilia ? ["codfamilia", "eq", codFamilia] : [])
        .success(response =>
          setOptions(
            response.data.map(subfamilia => {
              return {
                key: subfamilia.codsubfamilia,
                value: subfamilia.descripcion,
              };
            }),
          ),
        )
        .error(error => console.log("Error", error))
        .page({
          limit: 10000,
        })
        .go();
    } else {
      setOptions([]);
    }
  }, [codFamilia, global]);

  useEffect(() => {
    getOptions(codFamilia);
  }, [codFamilia, getOptions]);

  // useEffect(() => {
  //   getOptions()
  // }, [getOptions])

  return estatico ? (
    <Estatico id={id} {...props} />
  ) : (
    <Field.Select
      id={id}
      options={options}
      {...props}
      noOptionsText="Indica el nombre de la subfamilia"
    />
  );
}

export default Subfamilia;
