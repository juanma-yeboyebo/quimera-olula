import { Field, QSection, Typography } from "@quimera/comps";
import { Direccion } from "@quimera-extension/base-area_clientes";
import { FormaPago } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useAppValue, useStateValue, util } from "quimera";
import React from "react";

import { FormaEnvio } from "../../../comps";

function DatosCliente({ useStyles }) {
  const [, dispatch] = useStateValue();
  const [{ carrito }] = useAppValue();
  // const classes = useStyles()
  const schema = getSchemas().carrito;

  return (
    <Quimera.Template id="DatosCliente">
      <Typography variant="h3">{carrito.nombreCliente}</Typography>
      <Typography variant="h2">{util.euros(carrito.total)}</Typography>
      <QSection
        title="Dirección de entrega"
        actionPrefix="carrito"
        dynamicComp={() => <Quimera.SubView id="Checkout/DirCliente" modelName="carrito.buffer" />}
        saveDisabled={() => !schema.isValid(carrito)}
      >
        <Direccion documento={carrito} inline />
      </QSection>
      <QSection
        title="Forma de pago"
        actionPrefix="carrito"
        // alwaysInactive={disabled}
        saveDisabled={() => !schema.isValid(carrito)}
        dynamicComp={() => <FormaPago id="carrito.buffer.codPago" fullWidth autoFocus />}
      >
        <FormaPago id="carrito.buffer.codPago" estatico />
      </QSection>

      <QSection
        title="Forma de envío"
        actionPrefix="carrito"
        // alwaysInactive={disabled}
        saveDisabled={() => !schema.isValid(carrito)}
        dynamicComp={() => <FormaEnvio id="carrito.buffer.codEnvio" fullWidth autoFocus />}
      >
        <FormaEnvio id="carrito.buffer.codEnvio" estatico />
      </QSection>

      <QSection
        title="Observaciones"
        actionPrefix="carrito"
        // alwaysInactive={disabled}
        saveDisabled={() => !schema.isValid(carrito)}
        dynamicComp={() => (
          <Field.Schema id="carrito.buffer/observaciones" schema={schema} fullWidth label="" />
        )}
      >
        {carrito.observaciones ? (
          <Typography variant="body1">{carrito.observaciones}</Typography>
        ) : (
          <Typography variant="body2">{"Indique aquí sus observaciones"}</Typography>
        )}
      </QSection>
    </Quimera.Template>
  );
}

export default DatosCliente;
