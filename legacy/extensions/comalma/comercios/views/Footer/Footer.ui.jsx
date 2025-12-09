import Quimera, { PropValidation, useWidth } from "quimera";
import { Box } from "@quimera/comps";
import React from "react";

function Footer() {
  // const [{}, dispatch] = useStateValue()
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const style = !mobile ? { position: "relative", bottom: "10px", padding: "0px 12%" } : { position: "relative", bottom: "10px" };
  return (
    <Quimera.Template id="Footer">
      <Box style={style}>
        <img alt="Project logo" src="/img/logos-next-generation.png" style={{ maxWidth: "100%" }} />
      </Box>
    </Quimera.Template>
  );
}

export default Footer;
