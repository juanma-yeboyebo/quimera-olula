import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { useStateValue } from "quimera";

import NullishBoolean from "./NullishBoolean";

const useStyles = makeStyles(theme => ({
  box: {
    width: "100%",
    minHeight: "34px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ruleBox: {
    margin: "10px 0px",
    boxShadow: "3px 3px 3px 3px lightgrey",
  },
  heading: {
    fontSize: "1em",
    margin: "7.5px 0px",
  },
  notGeneral: {
    "details > summary &:before": {
      content: '"➡️"',
      marginRight: "5px",
      display: "inline-block",
      transition: "transform .3s ease",
    },
    "details[open] > summary &:before": {
      transform: "rotate(90deg)",
    },
  },
  type: {
    boxSizing: "border-box",
    fontSize: "0.9em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "110px",
    flexShrink: 0,
    color: "white",
    alignSelf: "stretch",
  },
  description: {
    flexGrow: 1,
    boxSizing: "border-box",
    padding: "4px 7.5px",
    backgroundColor: "white",
  },
  get: {
    backgroundColor: theme.palette.info.main,
  },
  post: {
    backgroundColor: theme.palette.success.main,
  },
  patch: {
    backgroundColor: theme.palette.warning.main,
  },
  delete: {
    backgroundColor: theme.palette.error.main,
  },
  custom: {
    backgroundColor: theme.palette.grey[800],
  },
}));

const defaultActions = {
  get: {
    klass: "get",
    description: "Lectura",
  },
  patch: {
    klass: "patch",
    description: "Modificación",
  },
  post: {
    klass: "post",
    description: "Creación",
  },
  delete: {
    klass: "delete",
    description: "Eliminación",
  },
  custom: {
    klass: "custom",
    description: "Acción",
  },
};

function AccessRule({ rule, heading = false, general = false }) {
  const [, dispatch] = useStateValue();

  const classes = useStyles();
  const action = defaultActions[rule?.idRegla?.split("/")[1] ?? ""] ?? defaultActions.custom;
  const divClasses = `${classes.type} ${classes[action.klass]}`;

  const classNames = `${classes.box} ${!heading && classes.ruleBox}`;
  const headingClasses = `${heading && classes.heading} ${
    heading && !general && classes.notGeneral
  }`;

  return (
    <Box className={classNames}>
      {!heading && (
        <>
          <div className={divClasses}>{action.description}</div>
          <div className={classes.description}>
            <span style={{ fontSize: "0.8em" }}>{rule?.descripcion}</span>
          </div>
        </>
      )}
      {heading && <h5 className={headingClasses}>{rule?.descripcion}</h5>}
      <NullishBoolean
        value={rule?.valor}
        style={{ maxHeight: "34px" }}
        onChanged={newValue =>
          dispatch({
            type: "onPermissionChanged",
            payload: { rule: rule?.idRegla, value: newValue },
          })
        }
      />
    </Box>
  );
}

export default AccessRule;
