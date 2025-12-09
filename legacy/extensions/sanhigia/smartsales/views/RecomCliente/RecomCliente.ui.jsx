import { Box, Container, ListInfiniteScroll, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

import { ButtonContacto, MainBox, RecomBlock } from "../../comps";

function RecomCliente({ cliente, direccion }) {
  const [{ clienteData, subfamilias }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        cliente,
        direccion,
      },
    });
  }, [dispatch, cliente, direccion]);

  return (
    <Quimera.Template id="RecomCliente">
      <Container maxWidth="xs">
        <MainBox title="Recomendaciones" before={true} />
        <MainBox>
          <Typography variant="h5">Cliente</Typography>
          <Typography variant="h6">{clienteData.nombre}</Typography>
          <Typography>{clienteData.direccion}</Typography>
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              margin: "20px 0",
            }}
          >
            <ButtonContacto
              icon="phone_enabled"
              klass="error"
              disabled={!clienteData?.telefono}
              onClick={() => (window.location.href = `tel://+34${clienteData?.telefono}`)}
            />
            <ButtonContacto
              icon="mail"
              klass="success"
              disabled={!clienteData?.email}
              onClick={() => (window.location.href = `mailto:${clienteData?.email}`)}
            />
            <ButtonContacto
              icon="whatsapp"
              klass="success_alt"
              disabled={!clienteData?.telefono}
              onClick={() => window.open(`https://wa.me/34${clienteData?.telefono}`, "_blank")}
            />
          </Box>
        </MainBox>
        <MainBox>
          <ListInfiniteScroll
            next={() => dispatch({ type: "onNextSubfamilias" })}
            hasMore={subfamilias?.page?.next !== null}
          >
            {subfamilias?.list
              ?.sort((a, b) => b.score - a.score || a.codsubfamilia - b.codsubfamilia)
              ?.map(subfamilia => (
                <RecomBlock
                  key={subfamilia.codsubfamilia}
                  variant="subfamilia"
                  item={subfamilia}
                  productos={subfamilia?.products}
                />
              ))}
          </ListInfiniteScroll>
        </MainBox>
      </Container>
    </Quimera.Template>
  );
}

export default RecomCliente;
