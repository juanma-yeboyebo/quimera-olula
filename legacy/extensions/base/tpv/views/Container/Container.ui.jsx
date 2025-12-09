import Quimera, { PropValidation } from "quimera";

import { TpvSync } from "../../comps";

function Container() {
  return (
    <Quimera.Template id="Container">
      <Quimera.Reference id="containerBlock" type="append">
        <TpvSync />
      </Quimera.Reference>
    </Quimera.Template>
  );
}

export default Container;
