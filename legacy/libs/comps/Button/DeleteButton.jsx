import { makeStyles } from "@quimera/styles";
import { util } from "quimera";

import { Icon, IconButton } from "../";
import Button from "./Button";

const useStyles = makeStyles(theme => ({
  contained: {
    backgroundColor: `${theme.palette.error.main}`,
    color: "white",
  },
  outlined: {
    color: `${theme.palette.error.main}`,
    borderColor: `${theme.palette.error.main}`,
  },
  text: {
    color: `${theme.palette.error.main}`,
  },
}));

function DeleteButton({ id, variant, text, icon, children, onlyText, onlyIcon, ...props }) {
  const classes = useStyles();

  variant = variant ?? "contained";

  return (
    <>
      {!onlyIcon && !onlyText && (
        <Button
          id={id ?? "deleteButton"}
          variant={variant}
          className={classes[variant]}
          startIcon={icon ?? <Icon>delete</Icon>}
          text={util.translate(text ?? "deleteFilterButton.text")}
          {...props}
        >
          {children ?? []}
        </Button>
      )}
      {!onlyIcon && !!onlyText && (
        <Button
          id={id ?? "deleteButton"}
          variant={variant}
          className={classes[variant]}
          text={util.translate(text ?? "deleteFilterButton.text")}
          {...props}
        >
          {children ?? []}
        </Button>
      )}
      {!!onlyIcon && !onlyText && (
        <IconButton id={id ?? "deleteButton"} className={classes.text} {...props}>
          {icon ?? <Icon>delete</Icon>}
        </IconButton>
      )}
    </>
  );
}

export default DeleteButton;
