import { Box, Typography, Collapse } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import React, { useState } from "react";


const useStyles = makeStyles(theme => ({
  CollapsibleBox: {
    color: "#505050",
    width: "100%",
    backgroundColor: "#e1e1e1",
    margin: "15px 5px 0px",
    padding: "5px 20px",
    boxSizing: "border-box",
  },
  CollapsibleBoxTitle: {
    textTransform: "uppercase",
    fontSize: "2rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  arrows: {
    fontSize: "1.3rem",
    flexShrink: "1",
    flexGrow: "0",
  },
  text: {
    flexShrink: "0",
    flexGrow: "1",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    maxWidth: "85%",
  },
  CollapsibleBoxTitleAft: {
    flexDirection: "row-reverse",
  },
  arrowBfr: {
    transform: "rotate(180deg)",
  },
  pointer: {
    cursor: "pointer",
  },
}));

export default function CollapsibleBox({
  className,
  title,
  before = false,
  collapsible = false,
  children,
  callbackCerrado,
  collapseContent = null,
  ...props
}) {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(collapsible);

  const collapse = () => {
    setCollapsed(!collapsed);
  };

  console.log(collapseContent);
  return (
    <Box className={`${className ?? ""} ${classes.CollapsibleBox}`} {...props}>
      {title && (
        <Typography
          variant="h1"
          className={`${classes.CollapsibleBoxTitle} ${before ? classes.CollapsibleBoxTitleBfr : classes.CollapsibleBoxTitleAft
            }`}
          data-cy={`boxtitle-${title}`}
        >
          <span
            className={`${classes.arrows} ${classes.pointer}`}
            onClick={collapse}
          >

            ❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯❯
          </span>
          <span className={classes.text}>{title}</span>
        </Typography>
      )}
      <Collapse in={collapsed} appear={collapsed}>
        {children}
      </Collapse>
      <Collapse in={!collapsed} >
        {collapseContent}
      </Collapse>
    </Box>
  );
}
