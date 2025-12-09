import { Box, Button, Dialog, DialogTitle, Icon, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { useStateValue, util } from "quimera";
import { useEffect, useRef, useState } from "react";

import Popover from "./Popover";

const useStyles = makeStyles(theme => ({
  seccion: {
    // marginTop: theme.spacing(1),
    "border": `2px solid ${theme.palette.grey[300]}`,
    "borderRadius": theme.spacing(0.5),
    // padding: theme.spacing(0.5),
    "cursor": "pointer",
    // height: '100%',
    "display": "flex",
    "flexDirection": "column",
    "boxSizing": "border-box",
    "&:focus-within": {
      border: `2px solid ${theme.palette.primary.light}`,
      paddingRight: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
      borderRadius: theme.spacing(0.5),
      outline: "none",
    },
    "&:hover": {
      border: `2px solid ${theme.palette.primary.light}`,
    },
  },
  seccionListItem: {
    // marginTop: theme.spacing(1),
    // padding: theme.spacing(0.5),
    // borderTop: `2px solid ${theme.palette.grey[200]}`,
    // borderBottom: `2px solid ${theme.palette.grey[200]}`,
    "cursor": "pointer",
    "&:focus-within": {
      // borderBottom: `2px solid ${theme.palette.secondary.light}`,
      // borderTop: `2px solid ${theme.palette.secondary.light}`,
      outline: "none",
    },
    // '&:hover': {
    //   borderBottom: `2px solid ${theme.palette.secondary.light}`,
    //   borderTop: `2px solid ${theme.palette.secondary.light}`,
    // }
  },
  seccionActivada: {
    overflow: "visible",
    border: `2px solid ${theme.palette.primary.light}`,
    // marginTop: theme.spacing(1),
    // padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    outline: "none",
    // position: 'relative',
    // left: -10,
    // top: 10,
    // background: 'yellow',
    // 'z-index': 4,
    // '-webkit-box-shadow': '0px 6px 6px 0px rgba(213,213,213,0.6)',
    // '-moz-box-shadow': '0px 6px 6px 0px rgba(213,213,213,0.6)',
    // '-ms-box-shadow': '0px 6px 6px 0px rgba(213,213,213,0.6)',
    // '-o-box-shadow': '0px 6px 6px 0px rgba(213,213,213,0.6)',
    // 'box-shadow': '0px 6px 6px 0px rgba(213,213,213,0.6)'
  },
  seccionListItemActivada: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
    outline: "none",
  },
  seccionButton: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
}));

function QSection({ actionPrefix, alwaysActive, alwaysInactive, cancelIcon, cancelText, cancelClassName, children, dialogProps, dynamicComp, ensureVisible, focusStyle = "box", mt, onFocus, p, popoverProps, readOnly, saveDisabled, saveIcon, saveText, saveClassName, title, variant = "default" }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const [active, setActive] = useState(alwaysActive || false);
  const [, dispatch] = useStateValue();

  const activeSectionRef = useRef(null);

  useEffect(() => {
    alwaysActive && setActive(true);
  }, [alwaysActive]);

  useEffect(() => {
    alwaysInactive && setActive(false);
  }, [alwaysInactive]);

  useEffect(() => {
    active &&
      activeSectionRef.current &&
      activeSectionRef.current.scrollIntoView({ behavior: "smooth" });
  }, [active, activeSectionRef]);

  const clases = {
    box: {
      true: classes.seccionActivada,
      false: classes.seccion,
    },
    listItem: {
      true: classes.seccionListItemActivada,
      false: classes.seccionListItem,
    },
    button: {
      true: classes.seccionActivada,
      false: classes.seccionButton,
    },
  };

  const activar = event => {
    variant === "popover" && setAnchorEl(event.currentTarget);
    setActive(true);
  };

  const desactivar = () => {
    variant === "popover" && setAnchorEl(null);
    setActive(false);
  };

  const cancelButton = (
    <Button
      id="cerrar"
      variant="text"
      color="secondary"
      text={cancelText ?? "Cancelar"}
      onClick={() => {
        dispatch({ type: `on${util.camelId(actionPrefix)}SeccionCancelada` });
        !alwaysActive && desactivar();
      }}
      startIcon={cancelIcon ?? <Icon>close</Icon>}
      className={cancelClassName}
    />
  );

  const saveButton = (
    <Button
      id="guardar"
      variant="text"
      color="primary"
      text={saveText ?? "Guardar"}
      onClick={() =>
        dispatch({
          type: `on${util.camelId(actionPrefix)}SeccionConfirmada`,
          payload: { onSuccess: () => !alwaysActive && desactivar() },
        })
      }
      startIcon={saveIcon ?? <Icon>save_alt</Icon>}
      disabled={saveDisabled && saveDisabled()}
      className={saveClassName}
    />
  );

  const closeButton = (
    <Button
      id="cerrar"
      variant="text"
      color="primary"
      text={saveText ?? "Cerrar"}
      onClick={() => {
        dispatch({
          type: `on${util.camelId(actionPrefix)}SeccionCerrada`,
          payload: { onSuccess: () => !alwaysActive && desactivar() },
        });
        !alwaysActive && desactivar();
      }}
      startIcon={cancelIcon ?? <Icon>close</Icon>}
      className={cancelClassName}
    />
  );

  const activeSection = dynamicComp && (
    <>
      {dynamicComp()}
      {readOnly ? (
        <Box display="flex" justifyContent="flex-end	">
          {closeButton}
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-around">
          {cancelButton}
          {saveButton}
        </Box>
      )}
    </>
  );

  const activeSectionVariants = {
    default: <Box ref={ensureVisible && activeSectionRef}>{activeSection}</Box>,
    popover: (
      <Popover
        id="section"
        open={active}
        anchorEl={anchorEl}
        onClose={desactivar}
        activeSection={activeSection}
        className={clases[focusStyle][active]}
        popoverProps={popoverProps}
      />
    ),
    dialog: (
      <>
        {children}
        <Dialog open={active} onClose={desactivar} {...dialogProps}>
          <DialogTitle>{title}</DialogTitle>
          <Box p={2}>{activeSection}</Box>
        </Dialog>
      </>
    ),
  };

  return (
    <Box
      className={clases[focusStyle][active]}
      tabIndex={0}
      mt={mt ?? 1}
      p={p ?? 0.5}
      onKeyPress={event => event.key === "Enter" && !active && activar(event)}
      onClick={!active && !alwaysInactive ? activar : undefined}
      onFocus={onFocus}
    >
      {title && (focusStyle !== "button" || active) && (
        <Typography variant="overline">{title}</Typography>
      )}
      {(!active && !alwaysActive) || alwaysInactive ? children : activeSectionVariants[variant]}
    </Box>
  );
}

// 
// 
export default QSection;
