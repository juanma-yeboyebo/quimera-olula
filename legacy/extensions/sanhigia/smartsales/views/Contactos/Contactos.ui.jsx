import { Box, Container, Typography } from "@quimera/comps";
import Quimera, { navigate, useStateValue } from "quimera";
import { useEffect } from "react";

import {
  FabButton,
  ListContactos,
  ListContactosActivos,
  ListInteracciones,
  MainBox,
  SearchContacto,
} from "../../comps";

function Contactos({ search, tipo, useStyles }) {
  const [
    { contactos, enInteracciones, interaccionesActivosData, interaccionesCursosData, totalpedidos },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    const searchParams = search ? new URLSearchParams(`search=${search}`) : null;
    dispatch({
      type: "onInit",
      payload: {
        search: searchParams?.get("search") ?? "",
        tipo,
      },
    });
  }, [dispatch, search, tipo]);

  return (
    <Quimera.Template id="Contactos">
      <Container maxWidth="xs">
        <FabButton icon="add" text="Contacto" onClick={() => navigate("/ss/contacto/nuevo")} />
        <MainBox
          title={enInteracciones ? (tipo === "cursos" ? "C. Cursos" : "C. Activos") : "Contactos"}
          before={true}
        >
          {totalpedidos > 0 && (
            <Box
              className={classes.pedidosOtrosHeader}
              onClick={() => navigate("/ss/ventas/pedidos/otrosagentes")}
            >
              <Typography variant="h3" className={classes.mainBoxSubtitle}>
                Hay
              </Typography>
              <span className={classes.listItemPedidosOtros}>
                <span className={classes.listItemPedidosOtrosAux}>{totalpedidos}</span>
              </span>
              <Typography variant="h3" className={classes.mainBoxSubtitle}>
                pedidos de otros agentes
              </Typography>
            </Box>
          )}
          {enInteracciones ? (
            tipo === "cursos" ? (
              <ListInteracciones
                contactos={interaccionesCursosData}
                onNext={() => dispatch({ type: `onNextInteraccionesCursosData` })}
              // maxHeight={totalpedidos > 0 ? 770 : 830}
              />
            ) : (
              <ListContactosActivos
                contactos={interaccionesActivosData}
                onNext={() => dispatch({ type: `onNextInteraccionesActivosData` })}
                maxHeight={830}
              />
            )
          ) : (
            <>
              <SearchContacto />
              <ListContactos
                contactos={contactos}
                onNext={() => dispatch({ type: `onNextContactos` })}
                maxHeight={790}
              />
            </>
          )}
        </MainBox>
      </Container>
    </Quimera.Template>
  );
}

export default Contactos;
