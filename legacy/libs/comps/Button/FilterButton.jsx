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

function FilterButton({ id, variant, text, icon, children, onlyText, onlyIcon, ...props }) {
  const classes = useStyles();

  variant = variant ?? "contained";

  return (
    <>
      {!onlyIcon && !onlyText && (
        <Button
          id={id ?? "filterButton"}
          variant={variant}
          className={classes[variant]}
          startIcon={icon ?? <Icon>filter_alt</Icon>}
          text={util.translate(text ?? "filterButton.text")}
          {...props}
        >
          {children ?? []}
        </Button>
      )}
      {!onlyIcon && !!onlyText && (
        <Button
          id={id ?? "filterButton"}
          variant={variant}
          className={classes[variant]}
          text={util.translate(text ?? "filterButton.text")}
          {...props}
        >
          {children ?? []}
        </Button>
      )}
      {!!onlyIcon && !onlyText && (
        <IconButton id={id ?? "filterButton"} className={classes.text} {...props}>
          {icon ?? <Icon>filter_alt</Icon>}
        </IconButton>
      )}
    </>
  );
}

export default FilterButton;
