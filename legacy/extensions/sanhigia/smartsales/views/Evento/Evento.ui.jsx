import { Box, Container } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useEffect } from "react";

import { FieldTitle, ListLineas, MainBox, ListContactoEvento } from "../../comps";

function Eventos({ codEvento }) {
  const [{ evento, lineaseventos, contactosevento }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        codEvento,
      },
    });
  }, [dispatch, codEvento]);

  return (
    <Quimera.Template id="Eventos">
      <Container maxWidth="xs">
        {/* <FabButton icon="add" text="Contacto" onClick={() => navigate("/ss/contacto/nuevo")} /> */}
        <MainBox title="Evento" before={true}>
          <Box w={1} display="flex" flexDirection="column" justifyContent="space-between">
            <FieldTitle>{evento?.nombre}</FieldTitle>
            <FieldTitle>{evento?.fechaIni}</FieldTitle>
          </Box>
        </MainBox>
        <MainBox>
          <Box w={1} display="flex" justifyContent="space-between">
            <FieldTitle>Productos</FieldTitle>
          </Box>
          <ListLineas lineas={lineaseventos} />
        </MainBox>
        <MainBox>
          <Box w={1} display="flex" justifyContent="space-between" >
            <FieldTitle>Contactos</FieldTitle>
          </Box>
          <ListContactoEvento contactos={contactosevento} />
        </MainBox>
      </Container>
    </Quimera.Template>
  );
}

export default Eventos;
