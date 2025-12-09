import { Direccion } from "@quimera-extension/base-area_clientes";
import { FormaEnvio } from "@quimera-extension/base-tienda_nativa";
import { Box, Field, QSection, Typography } from "@quimera/comps";
import { useTranslation } from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue, util } from "quimera";

function DatosCliente({ useStyles }) {
  const [{ carrito }, dispatch] = useStateValue();
  //const [{ carrito }] = useAppValue();
  // const classes = useStyles()
  const schema = getSchemas().carrito;
  const { t } = useTranslation();
  console.log(carrito);
  return (
    <Quimera.Template id="DatosCliente">
      <Typography variant="h4">{carrito.buffer.nombreCliente}</Typography>
      <Typography variant="h4">{util.euros(carrito.buffer.total)}</Typography>
      {/* <QSection
        title={t("checkout.direccionEntrega")}
        actionPrefix="carrito"
        dynamicComp={() => <Quimera.SubView id="Checkout/DirCliente" modelName="carrito.buffer" />}
        saveDisabled={() => !schema.isValid(carrito)}
      >
        <Direccion documento={carrito} inline />
      </QSection> */}
      {/* <QSection
        title={t("checkout.formaPago")}
        actionPrefix="carrito"
        // alwaysInactive={disabled}
        saveDisabled={() => !schema.isValid(carrito)}
        dynamicComp={() => <FormaPago id="carrito.buffer.codPago" fullWidth autoFocus />}
      >
        <FormaPago id="carrito.buffer.codPago" estatico />
      </QSection> */}
      <Box display={"flex"} justifyContent={"center"}>
        <Field.Schema id="carrito.buffer.fechaEntrega" schema={schema} />
      </Box>
      <QSection
        title={t("checkout.formaEnvio")}
        actionPrefix="carrito"
        alwaysInactive={false}
        saveDisabled={() => !schema.isValid(carrito.buffer)}
        dynamicComp={() =>
          <>
            <FormaEnvio id="carrito.buffer.codEnvio" fullWidth autoFocus />
            {carrito.buffer?.codEnvio == "NORMAL" && (
              <Quimera.SubView id="Checkout/DirCliente" modelName="carrito.buffer" />
            )}
          </>
        }
      >
        <FormaEnvio id="carrito.buffer.codEnvio" estatico variant="h6" />
        {carrito.buffer?.codEnvio == "NORMAL" && (
          <Direccion documento={carrito.buffer} inline />
        )}
      </QSection>

      <QSection
        title={t("checkout.observaciones")}
        actionPrefix="carrito"
        // alwaysInactive={disabled}
        saveDisabled={() => !schema.isValid(carrito.buffer)}
        dynamicComp={() => (
          <Field.Schema id="carrito.buffer/observaciones" schema={schema} fullWidth label="" />
        )}
      >
        {carrito.buffer.observaciones ? (
          <Typography variant="body1">{carrito.buffer.observaciones}</Typography>
        ) : (
          <Typography variant="body2">{t("checkout.textoDefectoObservaciones")}</Typography>
        )}
      </QSection>

      <Box mt={2} display="flex" flexDirection={"column"} style={{ gap: "10px" }}>
        <Typography variant="body2">{t("textoLegal.parrafo1")}</Typography>
        <Typography variant="body2">{t("textoLegal.parrafo2")}</Typography>
        <Typography variant="body2">{t("textoLegal.parrafo3")}</Typography>
      </Box>
    </Quimera.Template>
  );
}

export default DatosCliente;
