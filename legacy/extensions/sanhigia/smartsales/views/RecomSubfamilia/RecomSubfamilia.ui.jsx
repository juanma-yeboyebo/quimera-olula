import { Container, ListInfiniteScroll, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

import { MainBox, RecomBlock } from "../../comps";

function RecomSubfamilia({ subfamilia }) {
  const [{ subfamiliaData, clientes }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        subfamilia,
      },
    });
  }, [dispatch, subfamilia]);

  return (
    <Quimera.Template id="RecomSubfamilia">
      <Container maxWidth="xs">
        <MainBox title="Recomendaciones" before={true} />
        <MainBox>
          <Typography variant="h5">Subfamilia {subfamiliaData.codsubfamilia}</Typography>
          <Typography>{subfamiliaData.descripcion}</Typography>
        </MainBox>
        <MainBox>
          <ListInfiniteScroll
            next={() => dispatch({ type: "onNextClientes" })}
            hasMore={clientes?.page?.next !== null}
          >
            {clientes?.list
              ?.sort((a, b) => b.score - a.score || a.codDir - b.codDir)
              ?.map(cliente => (
                <RecomBlock
                  key={cliente.codDir}
                  variant="cliente"
                  item={cliente}
                  productos={cliente?.products}
                />
              ))}
          </ListInfiniteScroll>
        </MainBox>
      </Container>
    </Quimera.Template>
  );
}

export default RecomSubfamilia;
