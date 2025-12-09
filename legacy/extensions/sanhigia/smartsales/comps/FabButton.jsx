import { Fab, Icon, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

const useStyles = makeStyles(theme => ({
  button: {
    position: "fixed",
    bottom: "0px",
    right: "0px",
    zIndex: "1000",
    transform: "rotate(-90deg) translate(75%, -125%)",
    transformOrigin: "top right",
    backgroundColor: "#00D69C",
    textTransform: "uppercase",
  },
  buttonDisabled: {
    backgroundColor: "lightgrey",
    '&:hover': {
      backgroundColor: "lightgrey",
    },
  },
  icon: {
    fontWeight: "bold",
  },
  text: {
    fontWeight: "bold",
    color: "#FFF",
  },
}));

export default function FabButton({ className, icon, text, onClick, disabled, ...props }) {
  const classes = useStyles();

  const fabClasses = !disabled ? `${classes.button} ${className}` : `${classes.button} ${classes.buttonDisabled} ${className}`;

  return (
    <Fab className={fabClasses} color="primary" variant="extended" onClick={e => !disabled ? onClick?.(e) : ""}>
      {icon && (
        <Icon className={classes.icon}>{icon}</Icon>
      )}
      <Typography className={classes.text}>{text}</Typography>
    </Fab>
  );
}
