import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function QConfiguracion({ idTela = null, idModelo = null, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback(() => {
    const filtro = {
      and: [
        ["idmodelo", "eq", idModelo],
        ["precio", "gt", 0],
      ],
    };
    if (idTela && idModelo) {
      API("preciosbase")
        .get()
        .select("precio,confbase")
        .set("idTela", idTela)
        .set("idModelo", idModelo)
        .filter(filtro)
        .success(response =>
          setOptions(
            response.data.map((confi, index) => {
              return {
                key: confi.confbase,
                value: `[${index + 1}/${response.data.length}] ${confi.confbase} ${confi.descripcion
                  } (${util.euros(confi.precio)})`,
                option: confi,
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
  }, [idTela, idModelo]);

  useEffect(() => {
    getOptions();
  }, [idTela, idModelo]);

  return (
    <Field.Select
      options={options}
      noOptionsText="Escoja una tela para cargar las posibles configuraciones"
      {...props}
    />
  );
}

export default QConfiguracion;
