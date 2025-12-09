import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useEffect, useState } from "react";

function Contacto({ codcliente, ...props }) {
  // console.log('Contacto____useState', useState([]))
  const [options, setOptions] = useState([]);

  function getOptionLabel(contacto) {
    const match = options.filter(c => c.key === (contacto.key ?? contacto));

    return match && match.length === 1 ? match[0].value : contacto.key ?? contacto;
  }

  function getOptions(codcontacto) {
    API("contactos")
      .get()
      .select("codcontacto,nombre")
      .filter({ and: [["codcliente", "like", `${codcliente}`]] })
      .page({ limit: 500 })
      .order("codcontacto")
      .success(response => {
        setOptions(
          response.data.map(contacto => {
            return {
              key: contacto.codcontacto,
              value: `${contacto.nombre ? contacto.nombre : ""}`,
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
  }, [codcliente]);

  return (
    <Field.Autocomplete
      getOptions={getOptions}
      getOptionLabel={getOptionLabel}
      options={options}
      {...props}
    />
  );
}

export default Contacto;
