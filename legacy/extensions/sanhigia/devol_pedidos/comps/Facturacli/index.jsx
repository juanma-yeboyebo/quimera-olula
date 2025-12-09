import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

function Facturacli({ filtro = { and: [] }, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback((busqueda, key) => {
    const agente = util.getUser().codagente;

    const grupo = util.getUser().grupo;
    let filtroGrupo = {};
    if (grupo === "000002" || grupo === "000004" || grupo === "000006") {
      filtroGrupo = {
        or: [
          ["nombrecliente", "like", busqueda],
          ["codigo", "like", busqueda],
        ],
      };
    } else {
      filtroGrupo = {
        and: [
          ["codagente", "eq", agente],
          {
            or: [
              ["nombrecliente", "like", busqueda],
              ["codigo", "like", busqueda],
            ],
          },
        ],
      };
    }
    API("facturascli")
      .get()
      .select("idfactura,codigo,nombrecliente,fecha")
      .filter(filtroGrupo)
      // .order(() => ({ field: 'idinteriorismo', direction: 'ASC' }))
      .order("fecha DESC")
      .page({ limit: 50 })
      .success(response => {
        setOptions(
          response.data.map(factura => ({
            key: factura.idfactura,
            value: `${factura.nombrecliente} - ${factura.codigo} - ${
              factura.fecha ? util.formatDate(factura.fecha) : ""
            }`,
            option: factura,
          })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return <Field.Select getOptions={getOptions} options={options} {...props} async />;
}

export default Facturacli;
