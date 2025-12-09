import { Container, Icon } from "@quimera/comps";
import Quimera, { PropValidation } from "quimera";

import { MainBox } from "../../comps";

function RegNoEncontrado() {
  return (
    <Quimera.Template id="RegNoEncontrado">
      <Container maxWidth="xs">
        <MainBox title="" style={{ overflow: "auto", whiteSpace: "normal" }}>
          <h1>
            <Icon>error</Icon> Error
          </h1>
          <h4>El registro que busca no existe o no tiene permisos para acceder</h4>
        </MainBox>
      </Container>
    </Quimera.Template>
  );
}

export default RegNoEncontrado;
