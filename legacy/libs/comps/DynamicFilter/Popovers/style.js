import { makeStyles } from "@quimera/styles";

export const useStyles = makeStyles(theme => ({
  cabecera: {
    height: "40px",
    backgroundColor: theme.palette.primary.main,
    paddingLeft: "10px",
    paddingRight: "10px",
    marginBottom: "10px",
  },
  buttonPrimarioSmall: {
    fontSize: "12px",
    borderRadius: "5px",
    marginBottom: "10px",
    marginTop: "5px",
    ...theme.buttonPrimarioSmall,
  },
}));
