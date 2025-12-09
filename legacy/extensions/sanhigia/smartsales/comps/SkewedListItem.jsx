import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

import { BigNumUd } from ".";

const useStyles = makeStyles(theme => ({
  listItemFlex: {
    "boxSizing": "border-box",
    "margin": "5px",
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center",
    "width": "100%",
    "height": "100%",
    "maxHeight": "24px",
    "backgroundColor": "#fff",
    "padding": "2px 10px",
    "boxShadow": "-5px 0px 15px -8px rgba(0, 0, 0, 0.5)",
    "userSelect": "none",
    "zIndex": "50",
    "transform": "skew(-20deg)",
    "&>*": {
      transform: "skew(20deg)",
    },
  },
  listItemGridTres: {
    "boxSizing": "border-box",
    "margin": "5px",
    "display": "grid",
    "gridTemplateColumns": "2fr 1fr 1fr",
    "gap": "1em",
    "justifyContent": "flex-end",
    "width": "100%",
    "height": "100%",
    "maxHeight": "24px",
    "backgroundColor": "#fff",
    "padding": "2px 10px",
    "boxShadow": "-5px 0px 15px -8px rgba(0, 0, 0, 0.5)",
    "userSelect": "none",
    "zIndex": "50",
    "transform": "skew(-20deg)",
    "&>*": {
      transform: "skew(20deg)",
    },
  },
  listItemGridDos: {
    "boxSizing": "border-box",
    "margin": "5px",
    "display": "grid",
    "gridTemplateColumns": "2fr 1fr",
    "gap": "1em",
    "justifyContent": "flex-end",
    "width": "100%",
    "height": "100%",
    "maxHeight": "24px",
    "backgroundColor": "#fff",
    "padding": "2px 10px",
    "boxShadow": "-5px 0px 15px -8px rgba(0, 0, 0, 0.5)",
    "userSelect": "none",
    "zIndex": "50",
    "transform": "skew(-20deg)",
    "&>*": {
      transform: "skew(20deg)",
    },
  },
  darkListItem: {
    color: "white",
    backgroundColor: "#505050",
  },
  successListItem: {
    color: "white",
    backgroundColor: "#99E2CE",
  },
  errorListItem: {
    backgroundColor: "#FF9191",
    color: "white",
  },
  listItemDesc: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  disabled: {
    opacity: "0.5",
  },
  finished: {
    textDecoration: "line-through",
  },
}));

export default function SkewedListItem({
  text,
  data1,
  data2,
  type,
  dosGrid,
  adornment,
  dark,
  success,
  error,
  finished,
  onClick,
  ...props
}) {
  const classes = useStyles();

  let listItemClasses =
    type === "flex"
      ? classes.listItemFlex
      : dosGrid
        ? classes.listItemGridDos
        : classes.listItemGridTres;
  dark && (listItemClasses += ` ${classes.darkListItem}`);
  success && (listItemClasses += ` ${classes.successListItem} ${classes.disabled}`);
  error && (listItemClasses += ` ${classes.errorListItem} ${classes.disabled}`);
  finished && (listItemClasses += ` ${classes.finished}  ${classes.disabled}`);

  return (
    <Box className={listItemClasses} onClick={onClick} data-cy="contacto-list-item" {...props}>
      {text && <span className={classes.listItemDesc}>{text}</span>}
      {data1 && <BigNumUd data={data1} />}
      {data2 && <BigNumUd data={data2} />}
    </Box>
  );
}
