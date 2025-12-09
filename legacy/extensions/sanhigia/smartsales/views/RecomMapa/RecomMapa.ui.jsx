import { Container, ListInfiniteScroll } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useEffect } from "react";

import { MainBox, RecomBlock } from "../../comps";

function RecomMapa({ subfamilia, clientes }) {
  const [{ productos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        subfamilia,
        clientes,
      },
    });
  }, [dispatch, subfamilia, clientes]);

  return (
    <Quimera.Template id="RecomMapa">
      <Container maxWidth="xs">
        <MainBox title="Recomendaciones" before={true} />
        <MainBox>
          <ListInfiniteScroll
            next={() => dispatch({ type: "onNextProductos" })}
            hasMore={productos?.page?.next !== null}
          >
            {productos?.list
              ?.sort((a, b) => b.score - a.score || a.codDir - b.codDir)
              ?.map(row => (
                <RecomBlock
                  key={row.codDir}
                  variant="cliente"
                  item={row}
                  productos={row?.products}
                />
              ))}
          </ListInfiniteScroll>
        </MainBox>
      </Container>
    </Quimera.Template>
  );
}

export default RecomMapa;
