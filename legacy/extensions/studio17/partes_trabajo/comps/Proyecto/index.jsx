import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

import { default as Estatico } from "./estatico";

function Proyecto({ id, field, value, estatico, ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    // const filtroBase = key ? ["codcentro", "eq", key] : { or: [["descripcion", "like", text]] };
    const filtro = {
      and: [["codestado", "eq", "ABIERTO"]],
    };

    (text !== null || key !== null) &&
      API("s17_proyectos")
        .get()
        .select("codcentro,descripcion")
        .filter(filtro)
        .page({
          limit: 10000,
        })
        .success(response =>
          setOptions(
            response.data.map(proyecto => {
              return {
                key: proyecto.codcentro,
                value: `${proyecto.descripcion} ${proyecto.codcentro}`,
                option: proyecto,
              };
            }),
          ),
        )
        .error(error => console.log("Error", error))
        .go();
  }, []);

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, []);

  return estatico ? (
    <Estatico id={id} {...props} />
  ) : (
    <Field.Select
      id={id}
      getOptions={getOptions}
      options={options}
      noOptionsText="Buscar proyecto por nombre"
      async
      {...props}
    />
  );
}

export default Proyecto;
