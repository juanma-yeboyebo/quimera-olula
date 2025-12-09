import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import { useCallback, useState } from "react";

function Cosedor({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const filtroGrupo = {
      and: [
        ["idseccion", "eq", "'COSIDO'"],
        key ? ["nombre", "eq", key] : ["nombre", "like", text]
      ],
    };

    API("pr_trabajadores")
      .get()
      .select("idtrabajador,nombre")
      .filter(filtroGrupo)
      .success(response =>
        setOptions(
          response.data.map(trabajador => {
            return { key: trabajador.idtrabajador, value: trabajador.nombre };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Buscar cosedor por nombre"
      {...props}
      async
    />
  );
}

export default Cosedor;
