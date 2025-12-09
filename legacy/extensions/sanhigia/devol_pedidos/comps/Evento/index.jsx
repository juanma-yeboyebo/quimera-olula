import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function Evento({ codEvento, meses = null, ...props }) {
  const [options, setOptions] = useState([]);
  const ventaRegular = {
    key: "ventaregular",
    value: "Venta regular",
    option: { codevento: null, nombre: "Venta regular" },
  };
  let haceXMeses = null;
  if (meses) {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - meses);
    haceXMeses = util.dateToIsoString(fecha);
  }

  const getOptions = useCallback(
    (text, key) => {
      const filtroBase = key
        ? ["codevento", "eq", key]
        : {
          or: [
            ["codevento", "like", text ?? ""],
            ["nombre", "like", text ?? ""],
          ],
        };

      const filtro = meses
        ? {
          and: [["fechaalta", "gte", haceXMeses], ["tipoevento", "eq", "Curso"], filtroBase],
        }
        : filtroBase;

      API("eventos")
        .get()
        .select("codevento,nombre,fechaini")
        .filter(filtro)
        .success(response =>
          setOptions(
            response.data.map(evento => ({
              key: evento.codevento,
              value: evento.nombre,
              option: evento,
            })),
          ),
        )
        .error(error => console.log("Error", error))
        .go();
    },
    [codEvento],
  );

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, [codEvento]);

  return (
    <Field.Select
      getOptions={getOptions}
      options={[ventaRegular, ...options]}
      noOptionsText="Buscar evento..."
      {...props}
      async
    />
  );
}

export default Evento;
