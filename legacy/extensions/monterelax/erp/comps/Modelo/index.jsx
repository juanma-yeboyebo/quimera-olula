import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

// function Modelo ({ ...props }) {
//   const [options, setOptions] = useState([])

//   function getOptions (idmodelo) {
//     API('modelos')
//       .get()
//       .select('idmodelo')
//       .filter(['idmodelo', 'like', idmodelo])
//       cccccccccccccccc
//       .error(error => console.log('Error', error))
//       .go()
//   }

//   const getOptionLabel = option => option?.value ?? options?.filter(o => o.key === (option?.key ?? option))[0]?.value ?? option

//   return (
//     <Field.Select getOptions={ getOptions } getOptionLabel={ getOptionLabel } options={ options } { ...props} noOptionsText='Buscar por modelo' />
//   )
// }

function Modelo({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    // const schema = schemas.clientes

    API("modelos")
      .get()
      .select("idmodelo")
      .filter(key ? ["idmodelo", "eq", key] : ["idmodelo", "like", text])
      .success(response =>
        setOptions(
          response.data.map(modelo => {
            return { key: modelo.idmodelo, value: modelo.idmodelo };
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
      noOptionsText="Buscar por modelo"
      {...props}
      async
    />
  );
}

export default Modelo;
