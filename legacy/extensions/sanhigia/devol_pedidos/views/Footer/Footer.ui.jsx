import Quimera, { PropValidation } from "quimera";
import React from "react";

function Footer() {
  // const [{}, dispatch] = useStateValue()

  return (
    <Quimera.Template id="Footer">
      <Quimera.Reference id="Footertext" type="delete"></Quimera.Reference>
    </Quimera.Template>
  );
}

export default Footer;
