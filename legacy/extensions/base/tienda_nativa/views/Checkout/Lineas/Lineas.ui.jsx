import { Box, Button } from "@quimera/comps";
import { List, useTranslation } from "@quimera/thirdparty";
import Quimera, { navigate, useAppValue, useStateValue } from "quimera";

function Lineas({ useStyles }) {
  const [confirmando, dispatch] = useStateValue();
  const [{ carrito }] = useAppValue();
  const { t } = useTranslation();

  return (
    <Quimera.Template id="Lineas">
      <List disablePadding dense>
        {carrito.lineas.map(linea => (
          // <ItemLineaCarritoCheckout key={linea.idLinea} model={linea} modelName='lineaCarrito' />
          <Quimera.SubView
            id="ItemLineaCarritoCheckout"
            key={linea.idLinea}
            model={linea}
            modelName="lineaCarrito"
          />
        ))}
      </List>
      <Box mt={1} width={1} display="flex" justifyContent="space-around">
        <Button
          id="volverCatalogo"
          text={t("checkout.volverCatalogo")}
          variant="outlined"
          color="primary"
          onClick={() => navigate("/catalogo")}
        />
        <Button
          id="confirmarPedido"
          text={t("checkout.confirmarPedido")}
          variant="contained"
          color="primary"
          disable={confirmando.smState === "confirmando"}
        />
      </Box>
    </Quimera.Template>
  );
}

export default Lineas;
