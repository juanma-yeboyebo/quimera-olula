import { makeStyles } from "@quimera/styles";
import { useStateValue, util } from "quimera";
import React from "react";

import { Collapse, ListItem } from "../";

const useStyles = makeStyles(theme => ({
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function QListItemModel({ children, model, modelName, selected, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Collapse in={model?._status !== "deleted"} appear={model?._status === "new"}>
      <ListItem
        className={selected ? classes.cardSelected : classes.card}
        disableGutters
        onClick={() =>
          dispatch({ type: `on${util.camelId(modelName)}ItemSelected`, payload: { item: model } })
        }
        {...props}
      >
        {children}
      </ListItem>
    </Collapse>
  );
}

export default QListItemModel;
