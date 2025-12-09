import { Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

const useStyles = makeStyles(theme => ({
  title: {
    height: "100%",
    verticalAlign: "middle",
  },
}));

export default function FieldTitle({ children, className, variant = "h6", ...props }) {
  const classes = useStyles();

  return (
    <Typography variant={variant} className={`${classes.title} ${className ?? ""}`}>
      {children}
    </Typography>
  );
}
