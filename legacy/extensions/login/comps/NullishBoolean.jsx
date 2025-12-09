import { Button, Icon } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ButtonGroup } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";

const useStyles = makeStyles(theme => ({
  success: {
    width: "50px",
    backgroundColor: theme.palette.success.main,
    color: "white",
  },
  error: {
    width: "50px",
    backgroundColor: theme.palette.error.main,
    color: "white",
  },
  default: {
    width: "50px",
    backgroundColor: theme.palette.grey[600],
    color: "white",
  },
  disabled: {
    width: "50px",
    backgroundColor: "white",
    color: theme.palette.grey[600],
  },
}));

function NullishBoolean({ field, value, onChanged, ...props }) {
  const [state, dispatch] = useStateValue();
  const fieldValue = !value && field ? state[field] : value;
  const classes = useStyles();

  const onClick = newValue => {
    onChanged && onChanged(newValue);
    !onChanged &&
      dispatch({ type: `on${util.camelId(field)}Changed`, payload: { field, value: newValue } });
  };

  return (
    <ButtonGroup aria-label="outlined primary button group" {...props}>
      <Button
        id="NullishBooleanTrue"
        className={fieldValue ? classes.success : classes.disabled}
        onClick={() => onClick(true)}
      >
        <Icon>check</Icon>
      </Button>
      <Button
        id="NullishBooleanFalse"
        className={fieldValue === false ? classes.error : classes.disabled}
        onClick={() => onClick(false)}
      >
        <Icon>block</Icon>
      </Button>
      <Button
        id="NullishBooleanNull"
        className={
          fieldValue === null || fieldValue === undefined ? classes.default : classes.disabled
        }
        onClick={() => onClick(null)}
      >
        -
      </Button>
    </ButtonGroup>
  );
}

export default NullishBoolean;
