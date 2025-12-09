import { Chip } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import React from "react";

const useStyles = makeStyles(theme => ({
  chipNoDisponible: {
    color: `${theme.palette.secondary.main}`,
    border: `1px solid ${theme.palette.secondary.main}`,
  },
}));

function ChipNoDisponible({ ...props }) {
  const classes = useStyles();

  return <Chip size="small" label="No disponible" className={classes.chipNoDisponible} />;
}

export default ChipNoDisponible;
