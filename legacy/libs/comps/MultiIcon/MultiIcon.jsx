import { makeStyles } from "@quimera/styles";
import React from "react";

import { Icon } from "../";

const useStyles = makeStyles(theme => ({
  multiicon: {
    position: "relative",
    display: "inline-block",
    width: "100%",
    verticalAlign: "middle",
  },
  lg: {
    position: "absolute",
    left: "0",
    width: "100% !important",
    textAlign: "center",
    lineHeight: "inherit",
    color: theme.palette.primary.dark,
  },
  sm: {
    position: "absolute",
    borderRadius: "50%",
    textAlign: "center",
    top: "65%",
    left: "55%",
    color: "white",
    backgroundColor: theme.palette.secondary.main,
  },
}));

function MultiIcon({ children, className, lgColor, smColor, fontSize = 30 }) {
  const classes = useStyles();

  return (
    <i
      className={`${className} ${classes.multiicon}`}
      style={{
        height: `${fontSize}px`,
        lineHeight: `${fontSize}px`,
      }}
    >
      {children?.[0] && (
        <Icon
          className={classes.lg}
          style={{
            fontSize: `${fontSize}px`,
            color: lgColor,
          }}
        >
          {children[0]}
        </Icon>
      )}
      {children?.[1] && (
        <Icon
          className={classes.sm}
          style={{
            fontSize: `${fontSize * 0.4}px`,
            backgroundColor: smColor,
          }}
        >
          {children[1]}
        </Icon>
      )}
    </i>
  );
}

export default MultiIcon;
