import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import React, { useEffect, useState } from "react";

function Lote({ referencia, ...props }) {
  const [options, setOptions] = useState([]);

  function getOptions(codigo) {
    API("lotes")
      .get()
      .select("referencia,descripcion,codlote,codigo,caducidad")
      .filter({
        and: [
          ["referencia", "eq", referencia],
          ["codigo", "like", `${codigo}`],
        ],
      })
      .page({ limit: 500 })
      .order("caducidad")
      .success(response => {
        setOptions(
          response.data.map(lote => {
            return {
              key: `${lote.codlote}-${lote.codigo}`,
              value: `${lote.codigo} - ${lote.caducidad ? util.formatDate(lote.caducidad) : ""}`,
            };
          }),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, [referencia]);

  return <Field.Select getOptions={getOptions} options={options} async={true} {...props} />;
}

export default Lote;
