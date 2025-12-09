import React from "react";

import { Box, Typography } from "../../";

function TabPanel({ index, children, value, mobile, ...props }) {
  return (
    <Typography
      component="div"
      role="tabpanel"
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      hidden={value !== index}
      {...props}
    >
      <Box p={mobile ? 0 : 1}>{children}</Box>
    </Typography>
  );
}

export default TabPanel;
