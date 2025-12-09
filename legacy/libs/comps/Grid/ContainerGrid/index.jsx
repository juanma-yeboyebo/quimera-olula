import { Grid } from "@quimera/thirdparty";
import React from "react";

import HGrid from "../HGrid";
import ItemGrid from "../ItemGrid";
import VGrid from "../VGrid";

const ContainerGrid = React.forwardRef(({ childrenProps, children, ...props }, ref) => {
  const newChildren = React.Children.toArray(children).map((child, idx) => {
    if (child.type !== ItemGrid && child.type !== HGrid && child.type !== VGrid) {
      return (
        <ItemGrid key={child.key || child.name || idx} {...childrenProps}>
          {child}
        </ItemGrid>
      );
    }
    if (!child.props.item) {
      child = React.cloneElement(child, { item: true, ...child.props });
    }
    if (!child.props.xs) {
      child = React.cloneElement(child, { xs: true, ...child.props });
    }

    return React.cloneElement(child, {
      ...childrenProps,
      key: child.key || child.name || idx,
      ...child.props,
    });
  });

  return (
    <Grid container spacing={1} {...props} ref={ref}>
      {newChildren}
    </Grid>
  );
});

ContainerGrid.displayName = "ContainerGrid";
export default ContainerGrid;
