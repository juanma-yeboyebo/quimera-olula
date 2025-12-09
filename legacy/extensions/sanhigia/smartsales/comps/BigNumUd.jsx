import { makeStyles } from "@quimera/styles";

const useStyles = makeStyles(theme => ({
  listItemAuxData: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  listItemAux: {
    fontSize: "1.3rem",
    fontWeight: "700",
    lineHeight: "100%",
    verticalAlign: "bottom",
  },
  listItemAuxUd: {
    verticalAlign: "bottom",
    marginLeft: "2px",
    fontSize: "0.7rem",
  },
}));

export default function BigNumUd({ data, ...props }) {
  const classes = useStyles();

  return (
    <span className={classes.listItemAuxData} {...props}>
      <span className={classes.listItemAux}>{data[0]}</span>
      <span className={classes.listItemAuxUd}>{data[1]}</span>
    </span>
  );
}
