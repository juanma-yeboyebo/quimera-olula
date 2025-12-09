import { Button } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";

const useStyles = makeStyles(theme => ({
  button: {
    color: "white",
    backgroundColor: "#505050",
    width: "100%",
    fontSize: "1.7rem",
    fontWeight: "bold",
    margin: "5px",
    borderRadius: "0",
  },
}));

export default function ConfirmButton({
  id = "confirmBtn",
  text = "Confirmar",
  className,
  ...props
}) {
  const classes = useStyles();

  return (
    <Button
      id={id}
      variant="contained"
      className={`${classes.button} ${className ?? ""}`}
      {...props}
    >
      {text}
    </Button>
  );
}
