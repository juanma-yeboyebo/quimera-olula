import { Field } from "@quimera/comps";
import { getSchemas } from "quimera";
import { API } from "quimera/lib";
import { useEffect, useState } from "react";

export default function CausaPerdidaTrato({ idTipotrato, schema, ...props }) {
  const [options, setOptions] = useState([]);
  const getOptions = () => options;

  useEffect(() => {
    const schema = getSchemas().causasPerdidaTrato;
    API("ss_causasperdidatrato")
      .get()
      .select("idperdida,descripcion")
      .filter(["idtipotrato", "eq", idTipotrato])
      .page({ limit: 100 })
      .success(response =>
        setOptions(
          response.data
            .map(_causasPerdidaTrato => schema.load(_causasPerdidaTrato))
            .map(_causasPerdidaTrato => ({
              key: _causasPerdidaTrato.idPerdida,
              value: _causasPerdidaTrato.descripcion,
              option: _causasPerdidaTrato,
            })),
        ),
      )
      .error(error => console.log("Error", error))
      .go();
  }, []);

  return <Field.Select getOptions={getOptions} options={options} className="CausaPerdida" {...props} async />;
}
