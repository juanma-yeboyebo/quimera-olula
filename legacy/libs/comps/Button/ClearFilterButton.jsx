import { makeStyles } from "@quimera/styles";
import { util } from "quimera";

import { Icon, IconButton } from "../";
import Button from "./Button";

const useStyles = makeStyles(theme => ({
  contained: {
    backgroundColor: `${theme.palette.primary.main}`,
    color: "white",
  },
  outlined: {
    color: `${theme.palette.primary.main}`,
    borderColor: `${theme.palette.primary.main}`,
  },
  text: {
    color: `${theme.palette.primary.main}`,
  },
}));

function ClearFilterButton({ id, variant, text, icon, children, onlyText, onlyIcon, ...props }) {
  const classes = useStyles();

  variant = variant ?? "contained";

  return (
    <>
      {!onlyIcon && !onlyText && (
        <Button
          id={id ?? "clearFilterButton"}
          variant={variant}
          className={classes[variant]}
          startIcon={icon ?? <Icon>cleaning_services</Icon>}
          text={util.translate(text ?? "clearFilterButton.text")}
          {...props}
        >
          {children ?? []}
        </Button>
      )}
      {!onlyIcon && !!onlyText && (
        <Button
          id={id ?? "clearFilterButton"}
          variant={variant}
          className={classes[variant]}
          text={util.translate(text ?? "clearFilterButton.text")}
          {...props}
        >
          {children ?? []}
        </Button>
      )}
      {!!onlyIcon && !onlyText && (
        <IconButton id={id ?? "clearFilterButton"} className={classes.text} {...props}>
          {icon ?? <Icon>cleaning_services</Icon>}
        </IconButton>
      )}
    </>
  );
}

export default ClearFilterButton;
