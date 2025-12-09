import { Box, Button, Dialog, Grid, Icon, QBox, QSection, Typography } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

import { ListContactoCliente } from "../../comps";

function Cliente({ callbackChanged, codCliente, initCliente, useStyles }) {
  const [{ cliente, contactos, modalCrearContactoVisible, modalAnadirContactoVisible }, dispatch] =
    useStateValue();
  const schema = getSchemas().cliente;
  const classes = useStyles();

  useEffect(() => {
    util.publishEvent(cliente.event, callbackChanged);
  }, [cliente.event.serial]);

  useEffect(() => {
    !!initCliente &&
      dispatch({
        type: "onInitCliente",
        payload: {
          initCliente,
          callbackChanged,
        },
      });
    !initCliente &&
      !!codCliente &&
      dispatch({
        type: "onInitClienteById",
        payload: {
          action: "dame_clientes",
          filterCliente: ["codcliente", "eq", codCliente],
          callbackChanged,
        },
      });
  }, [initCliente, codCliente]);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  // const actionEnabled = () => ACL.can("ss_campanias:visit");
  const actionEnabled =
    util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing"
      ? false
      : true;

  if ((!initCliente && !codCliente) || initCliente?._status === "deleted") {
    return null;
  }

  if (codCliente && !cliente.data.codCliente) {
    return null;
  }

  return (
    <Quimera.Template id="Cliente">
      <QBox
        width={anchoDetalle}
        titulo={cliente.buffer?.nombre}
        botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        sideButtons={<></>}
      >
        <Grid container spacing={0} display="flex">
          <Grid item xs={12} sm={12}>
            {/* <QSection title={`Nombre Cliente`} actionPrefix="cliente.buffer/nombre" alwaysInactive>
              <Box display="flex">
                <Typography variant="body1">{cliente.buffer.nombre || ""}</Typography>
              </Box>
            </QSection> */}
            <QSection title={`Agente`} actionPrefix="cliente.buffer/nombreAgente" alwaysInactive>
              <Box display="flex">
                <Typography variant="body1">{cliente.buffer.nombreAgente || ""}</Typography>
              </Box>
            </QSection>
          </Grid>
          <Box display={"flex"} justifyContent={"space-between"} width={1}>
            <Grid item xs={6} sm={6}>
              <QSection title={`Forma de pago`} actionPrefix="cliente.buffer/formaPago" alwaysInactive>
                <Box display="flex">
                  <Typography variant="body1">{cliente.buffer.formaPago || ""}</Typography>
                </Box>
              </QSection>
            </Grid>
            <Grid item xs={6} sm={6}>
              <QSection title={`Telefono`} actionPrefix="cliente.buffer/telefono" alwaysInactive>
                <Box display="flex">
                  <Typography variant="body1">{cliente.buffer.telefono || ""}</Typography>
                </Box>
              </QSection>
            </Grid>
          </Box>
          <Grid item xs={12} sm={12}>
            <QSection title={`Direccion`} actionPrefix="cliente.buffer/dirCliente" alwaysInactive>
              <Box display="flex">
                <Typography variant="body1">{cliente.buffer.dirCliente || ""}</Typography>
              </Box>
            </QSection>
          </Grid>
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Button
            id="anadirContacto"
            color="primary"
            disabled={actionEnabled}
            onClick={() => dispatch({ type: "onAnadirContactoClicked" })}
          >
            <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
              <Icon>add</Icon>
              Añadir contacto
            </Box>
          </Button>
        </Box>
        <Box style={{ margin: "0px", marginBottom: "50px" }}>
          <ListContactoCliente lineas={contactos} />
        </Box>
        <Dialog open={modalCrearContactoVisible} fullWidth maxWidth="xs">
          <Quimera.View
            id="NuevoContacto"
            callbackCerrado={payload => dispatch({ type: "onCerrarCrearContacto", payload })}
            codCliente={cliente.data.codCliente}
          />
        </Dialog>
        {/* <Dialog open={modalAnadirContactoVisible} fullWidth maxWidth="xs">
          <Container maxWidth="xs">
            <MainBox
              title="Añadir contacto"
              before={true}
              callbackCerrado={payload => dispatch({ type: "onCerrarAnadirContacto", payload })}
            >
              <Contacto id="contactoAnadir" label="Contacto" fullWidth async />
              <Button
                id="crearNuevoContacto"
                text="Crear nuevo contacto"
                variant="text"
                color="primary"
                disabled={false}
              />
            </MainBox>
            <ConfirmButton id="saveContacto" className="confirmarAnadirContacto" />
          </Container>
        </Dialog> */}
      </QBox>
    </Quimera.Template>
  );
}

export default Cliente;
