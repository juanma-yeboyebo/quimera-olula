import { Avatar as AvatarMUI } from "@quimera/thirdparty";
import React from "react";

function Avatar({ size = "50px", ...props }) {
  return <AvatarMUI alt="" style={{ width: size, height: size }} {...props} />;
}

export default Avatar;
