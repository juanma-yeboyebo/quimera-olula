import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function S17Articulo({ id, superfamilia, field, value, estatico, ...props }) {
  const [options, setOptions] = useState([]);
  const filtro =
    util.getUser()?.oficio !== "Todos"
      ? {
        and: [
          ["tipo", "eq", superfamilia],
          {
            or: [
              ["s17_oficio", "eq", util.getUser()?.oficio],
              ["s17_oficio", "eq", "Todos"],
            ],
          },
        ],
      }
      : ["tipo", "eq", superfamilia];
  console.log("familia S17Articulo", superfamilia);

  const getOptions = useCallback((text, key) => {
    (text !== null || key !== null) &&
      API("articulos")
        .get()
        .select("referencia,descripcion")
        .filter(filtro)
        .page({
          limit: 10000,
        })
        .success(response =>
          setOptions(
            response.data.map(articulo => {
              return {
                key: articulo.referencia,
                value: `${articulo.descripcion} (${articulo.referencia})`,
                option: articulo,
              };
            }),
          ),
        )
        .error(error => console.log("Error", error))
        .go();
  }, []);

  useEffect(() => {
    // para la primera vez
    getOptions(" ");
  }, []);

  return estatico ? (
    <Estatico id={id} {...props} />
  ) : (
    <Field.Select
      id={id}
      disabled={!superfamilia}
      getOptions={getOptions}
      options={options}
      noOptionsText="Buscar trabajo por nombre"
      async
      {...props}
    />
  );
}

export default S17Articulo;
