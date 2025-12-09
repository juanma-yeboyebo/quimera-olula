import { Field } from "@quimera/comps";
import { util } from "quimera";
import { API } from "quimera/lib";
import { useCallback, useEffect, useState } from "react";

//import schemas from '../../static/schemas'
import schemas from "./schemas";

function DirCliente({ codCliente, soloDirEnvio = false, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = useCallback(codCliente => {
    //const schema = getSchemas().dirClientes
    const schema = schemas.dirClientes;
    const filtroBase = ["codcliente", "eq", codCliente];
    const filtro = soloDirEnvio
      ? {
        and: [["domenvio", "eq", true], filtroBase],
      }
      : filtroBase;
    function setDirecciones(direcciones) {
      setOptions(
        direcciones
          .map(d => schema.load(d))
          .map(dir => {
            return { key: dir.codDir, value: util.buildAddress(dir, true), option: dir };
          }),
      );
    }
    API("dirclientes")
      .get()
      .select(schema.fields)
      .filter(filtro)
      .success(response => setDirecciones(response.data))
      .error(error => console.log("Error", error))
      .go();
  }, []);

  useEffect(() => {
    getOptions(codCliente);
  }, [codCliente, getOptions]);

  return (
    <Field.Select
      options={options}
      getOptions={getOptions}
      noOptionsText="No hay direcciones"
      {...props}
    />
  );
}

export default DirCliente;
