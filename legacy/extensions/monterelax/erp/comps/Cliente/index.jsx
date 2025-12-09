import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

// function Cliente ({ ...props }) {
//   const [options, setOptions] = useState([])

//   function getOptions (nombre) {
//     API('clientes')
//       .get()
//       .select('codcliente,nombre')
//       .filter(['nombre', 'like', nombre])
//       .success(response => setOptions(response.data.map(cliente => { return { key: cliente.codcliente, value: cliente.nombre } })))
//       .error(error => console.log('Error', error))
//       .go()
//   }

//   const getOptionLabel = option => option?.value ?? options?.filter(o => o.key === (option?.key ?? option))[0]?.value ?? option

//   return (
//     <Field.Select getOptions={ getOptions } getOptionLabel={ getOptionLabel } options={ options } { ...props} noOptionsText='Buscar cliente por nombre' />
//   )
// }

function Cliente({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    // const schema = schemas.clientes

    API("clientes")
      .get()
      .select("codcliente,nombre")
      .filter(key ? ["codcliente", "eq", key] : ["nombre", "like", text])
      .success(response =>
        setOptions(
          response.data.map(cliente => {
            return { key: cliente.codcliente, value: cliente.nombre };
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
      noOptionsText="Buscar cliente por nombre"
      {...props}
      async
    />
  );
}

export default Cliente;
