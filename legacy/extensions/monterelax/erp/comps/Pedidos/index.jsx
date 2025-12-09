import { Field } from "@quimera/comps";
import { API } from "quimera/lib";
import React, { useCallback, useState } from "react";

// function Pedidos ({ ...props }) {
//   const [options, setOptions] = useState([])

//   function getOptions (referencia) {
//     API('pedidoscli')
//       .get()
//       .select('referencia')
//       .filter(['referencia', 'like', referencia])
//       .success(response => setOptions(response.data.map(pedido => { return { key: pedido.referencia, value: pedido.referencia } })))
//       .error(error => console.log('Error', error))
//       .go()
//   }

//   const getOptionLabel = option => option.value ?? option

//   return (
//     <Field.Select getOptions={ getOptions } getOptionLabel={ getOptionLabel } options={ options } { ...props} />
//   )
// }

function Pedidos({ ...props }) {
  const [options, setOptions] = useState([]);

  const getOptions = useCallback((text, key) => {
    API("pedidoscli")
      .get()
      .select("referencia")
      .filter(key ? ["referencia", "eq", key] : ["referencia", "like", text])
      .success(response =>
        setOptions(
          response.data.map(pedido => {
            return { key: pedido.referencia, value: pedido.referencia };
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
      noOptionsText="Buscar por referencia"
      {...props}
      async
    />
  );
}

export default Pedidos;
