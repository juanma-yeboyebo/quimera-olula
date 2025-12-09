import { Box, Popover } from "@quimera/comps";
import React from "react";

function VariantPopover({ activeSection, anchorEl, className, id, onClose, open, popoverProps }) {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      {...popoverProps}
      // elevation={0}
    >
      <Box className={className} p={0.5}>
        {activeSection}
      </Box>
    </Popover>
    //
  );
}

export default VariantPopover;
