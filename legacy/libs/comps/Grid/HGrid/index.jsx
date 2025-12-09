import React from "react";

import ContainerGrid from "../ContainerGrid";

const HGrid = React.forwardRef(({ ...props }, ref) => {
  return <ContainerGrid direction="row" {...props} ref={ref} />;
});

HGrid.displayName = "HGrid";
export default HGrid;
