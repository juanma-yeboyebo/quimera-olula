import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useEffect, useState } from "react";

function CampanasFieldSelect({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    const texto = text ?? "";

    const filtroBase = ["1", "eq", "1"];

    API("ca_campanas")
      .get()
      .select("idcampana,nombre")
      .filter(filtroBase)
      .order("nombre ASC")
      .page({ limit: 100 })
      .success(response => {
        setOptions(
          response.data.map(campana => ({
            key: campana.idcampana,
            value: `${campana.nombre}`,
            option: campana,
          })),
        );
      })
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    // para la primera vez
    getOptions("");
  }, []);

  return (
    <Field.Select
      getOptions={getOptions}
      options={options}
      noOptionsText="Campaña"
      {...props}
      async
    />
  );
}

export default CampanasFieldSelect;
