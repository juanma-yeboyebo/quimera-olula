import { Box, Container, Grid, Typography } from "@quimera/comps";
import { Trans, useTranslation } from "@quimera/thirdparty";
import Quimera, { A, useAppValue, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function Checkout({ callbackChanged, useStyles }) {
  const [{ smState, lineasCarrito }, dispatch] = useStateValue();
  const [{ carrito }] = useAppValue();
  const { t } = useTranslation();

  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    dispatch({
      type: "onInitCarritoChangedLocal",
      payload: {
        initCarrito: carrito,
      },
    });
  }, [carrito]);

  const edicion = (
    <Box mt={2}>
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          <Grid item sm={12} md={6}>
            <Quimera.SubView id="Checkout/DatosCliente" />
          </Grid>
          <Grid item sm={12} md={6}>
            <Quimera.SubView id="Checkout/Lineas" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  const subviewsEstado = {
    edicion,
    confirmando: edicion,
    confirmacion: <Quimera.SubView id="Checkout/Confirmacion" />,
    vacio: (
      <Typography variant="h4">
        <Trans i18nKey="carrito.carritoVacío">
          Tu carrito está vacío, <A href="/catalogo">catalogo</A> para escoger tus productos{" "}
        </Trans>
      </Typography>
    ),
  };

  return <Quimera.Template id="Checkout">{subviewsEstado[smState]}</Quimera.Template>;
}

export default Checkout;
