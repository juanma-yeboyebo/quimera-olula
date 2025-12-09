import { Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

const useStyles = makeStyles(theme => ({
  value: {
    marginLeft: "1em",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

export default function FieldValue({ children, className, variant = "h6", ...props }) {
  const classes = useStyles();

  return (
    <Typography variant={variant} className={`${classes.value} ${className ?? ""}`}>
      {children}
    </Typography>
  );
}
