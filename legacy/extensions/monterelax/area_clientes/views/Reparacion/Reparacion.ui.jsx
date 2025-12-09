import { Box, Button, Grid, QBox, QSection, Typography } from "@quimera/comps";
import Quimera, { getSchemas, navigate, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

function Reparacion({ callbackChanged, initReparacion, useStyles }) {
  const [
    {
      reparacion,
      idTipoTratoNuevaCampania,
      lineaseventos,
      contactosevento,
      modalCrearCampaniaVisible,
      modalCrearContactoVisible,
      erroresCarga,
      modalAnadirContactoVisible,
      modalErroresCargaContactosExcel,
    },
    dispatch,
  ] = useStateValue();
  const schema = getSchemas().reparaciones;
  const classes = useStyles();

  useEffect(() => {
    util.publishEvent(reparacion.event, callbackChanged);
  }, [reparacion.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitReparacion",
      payload: {
        initReparacion,
      },
    });
  }, [dispatch, initReparacion]);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  // const actionEnabled = () => ACL.can("ss_campanias:visit");
  const actionEnabled =
    util.getUser()?.superuser ||
      util.getUser().group === "MKT" ||
      util.getUser().group === "Responsable de marketing"
      ? false
      : true;

  const estados = {
    "PTE": {
      titulo: "Pendiente",
    },
    "PTE RECOGIDA": {
      titulo: "Pendiente de recogida",
    },
    "TERMINADO": {
      titulo: "Terminado",
    },
    "SERVIDO": {
      titulo: "Servido",
    },
  };

  return (
    <Quimera.Template id="Reparacion">
      <QBox
        width={anchoDetalle}
        titulo={initReparacion?.idReparacion}
        botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        sideButtons={<></>}
      >
        <Grid container spacing={0}>
          {/* <Grid item xs={12} sm={12}>
            <QSection
              title={`Nombre Reparacion`}
              actionPrefix="reparacion.buffer/nombre"
              alwaysInactive
            >
              <Box display="flex">
                <Typography variant="body1">
                  {reparacion.buffer.nombre || ""}
                </Typography>
              </Box>
            </QSection>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <QSection title="Estado" actionPrefix="reparacion.estado" alwaysInactive>
              <Box display="flex">
                <Typography variant="body2">
                  {estados[reparacion?.buffer?.estado]?.titulo}
                </Typography>
              </Box>
            </QSection>
          </Grid>
          <Grid item xs={12} sm={6}>
            <QSection title="Fecha" actionPrefix="reparacion.fechaIni" alwaysInactive>
              <Box display="flex">
                <Typography variant="body2">{reparacion?.buffer?.fecha}</Typography>
              </Box>
            </QSection>
          </Grid>

          <Grid item xs={12} sm={12}>
            <QSection title="Causa" actionPrefix="reparacion.descripcionCausa" alwaysInactive>
              <Box display="flex">
                <Typography variant="body2">{reparacion?.buffer?.descripcionCausa}</Typography>
              </Box>
            </QSection>
          </Grid>

          {reparacion?.data?.referencia && (
            <Grid item xs={12} sm={12}>
              <QSection
                title={`Pedido:${reparacion?.data?.referencia ? ` (${reparacion?.data?.referencia})` : ""
                  }`}
                actionPrefix="reparacion.referencia"
                alwaysInactive
              >
                <Box display="flex">
                  <Button
                    id="crearCampania"
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      navigate(`/areaclientes/pedidos/${reparacion?.data?.idPedidoAsociado}`)
                    }
                  >
                    <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                      {reparacion?.data?.pedidoAsociado}
                    </Box>
                  </Button>
                </Box>
              </QSection>
            </Grid>
          )}
        </Grid>
      </QBox>
    </Quimera.Template>
  );
}

export default Reparacion;
