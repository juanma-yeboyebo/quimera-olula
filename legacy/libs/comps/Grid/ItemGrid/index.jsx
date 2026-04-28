import { Grid } from "@quimera/thirdparty";
import React from "react";

export default function ItemGrid({ ...props }) {
  return <Grid container size="grow" {...props} />;
}
