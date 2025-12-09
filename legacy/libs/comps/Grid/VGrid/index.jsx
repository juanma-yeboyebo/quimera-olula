import React from "react";

import ContainerGrid from "../ContainerGrid";

const VGrid = React.forwardRef(({ ...props }, ref) => {
  return <ContainerGrid direction="column" {...props} ref={ref} />;
});

VGrid.displayName = "VGrid";
export default VGrid;
