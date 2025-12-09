import { makeStyles } from "@quimera/styles";
import { t } from "i18next";
import { useStateValue, util } from "quimera";
import React, { useEffect, useRef, useState } from "react";

import { Box, Button, Collapse, Dialog, DialogTitle, Icon, Typography } from "../";
import Popover from "./Popover";

const useStyles = makeStyles(theme => ({
  seccion: {
    "border": `2px solid ${theme.palette.grey[300]}`,
    "borderRadius": theme.spacing(0.5),
    "cursor": "pointer",
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
  seccionInhabilitada: {
    border: `2px solid ${theme.palette.grey[200]}`,
    borderRadius: theme.spacing(0.5),
    display: "flex",
    flexDirection: "column",
  },
  seccionListItem: {
    "cursor": "pointer",
    "&:focus-within": {
      outline: "none",
    },
  },
  seccionActivada: {
    overflow: "visible",
    border: `2px solid ${theme.palette.primary.light}`,
    borderRadius: theme.spacing(0.5),
    outline: "none",
  },
  seccionListItemActivada: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
    outline: "none",
  },
  seccionNoneActivada: {
    border: "none",
    outline: "none",
  },
  seccionButton: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
}));

function QSection({
  actionPrefix,
  alwaysActive,
  alwaysInactive,
  cancel,
  collapsible,
  close,
  children,
  dialogProps,
  dynamicComp,
  ensureVisible,
  estilos,
  focusStyle = "box",
  mr,
  mt,
  onFocus,
  p,
  popoverProps,
  readOnly,
  saveDisabled,
  save,
  title,
  variant = "default",
  activation,
  maxWidth = "sm",
  minWidth,
  ...props
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  let active, setActive;
  if (activation) {
    ({ active, setActive } = activation);
  } else {
    [active, setActive] = useState(alwaysActive || false);
  }

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
      activada: classes.seccionActivada,
      desactivada: classes.seccion,
      inhabilitada: classes.seccionInhabilitada,
    },
    listItem: {
      activada: classes.seccionListItemActivada,
      desactivada: classes.seccionListItem,
      inhabilitada: classes.seccionListItem,
    },
    button: {
      activada: classes.seccionActivada,
      desactivada: classes.seccionButton,
      inhabilitada: classes.seccionButton,
    },
    none: {
      activada: classes.seccionNoneActivada,
      desactivada: classes.seccionButton,
      inhabilitada: classes.seccionButton,
    },
  };

  const getModoActivacion = () => {
    if (alwaysInactive) {
      return "inhabilitada";
    }
    if (alwaysActive) {
      return "activada";
    }
    if (active) {
      return "activada";
    }

    return "desactivada";
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
      text={cancel?.text ?? t("qSection.cancelar")}
      onClick={
        cancel?.callback
          ? () => cancel.callback()
          : () => {
              dispatch({
                type: `on${util.camelId(actionPrefix)}SectionCancelled`,
                payload: { section: util.lastStateField(actionPrefix) },
              });
              dispatch({
                type: `on${util.camelId(actionPrefix)}SeccionCancelada`,
                payload: { section: util.lastStateField(actionPrefix) },
              });
              !alwaysActive && desactivar();
            }
      }
      startIcon={cancel?.icon ?? <Icon>close</Icon>}
      disabled={cancel?.disabled?.() || false}
      className={cancel?.className}
    />
  );

  const saveButton = (
    <Button
      id="guardar"
      variant="text"
      color="primary"
      text={save?.text ?? t("qSection.guardar")}
      onClick={
        save?.callback
          ? () => save.callback()
          : () => {
              dispatch({
                type: `on${util.camelId(actionPrefix)}SectionAccepted`,
                payload: {
                  section: util.lastStateField(actionPrefix),
                  onSuccess: () => !alwaysActive && desactivar(),
                },
              });
              dispatch({
                type: `on${util.camelId(actionPrefix)}SeccionConfirmada`,
                payload: {
                  section: util.lastStateField(actionPrefix),
                  onSuccess: () => !alwaysActive && desactivar(),
                },
              });
            }
      }
      startIcon={save?.icon ?? <Icon>save_alt</Icon>}
      disabled={save?.disabled?.() || (saveDisabled && saveDisabled())}
      className={save?.className}
    />
  );

  const closeButton = (
    <Button
      id="cerrar"
      variant="text"
      color="primary"
      text={(close?.text || save?.text) ?? t("qSection.cerrar")}
      onClick={
        close?.callback
          ? () => close.callback()
          : () => {
              dispatch({
                type: `on${util.camelId(actionPrefix)}SeccionCerrada`,
                payload: { onSuccess: () => !alwaysActive && desactivar() },
              });
              !alwaysActive && desactivar();
            }
      }
      startIcon={(close?.icon || cancel?.icon) ?? <Icon>close</Icon>}
      disabled={close?.disabled?.() || false}
      className={close?.className || cancel?.className}
    />
  );

  const activeSection = dynamicComp && (
    <>
      {dynamicComp(desactivar)}
      {readOnly ? (
        <Box display="flex" justifyContent="flex-end">
          {close?.display !== "none" && closeButton}
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-around">
          {cancel?.display !== "none" && cancelButton}
          {save?.display !== "none" && saveButton}
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
        className={clases[focusStyle][getModoActivacion()]}
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

  const inactive = (!active && !alwaysActive) || alwaysInactive;

  return inactive && !children ? null : (
    <Box
      className={`${clases[focusStyle][getModoActivacion()]} ${
        estilos ? estilos[focusStyle][getModoActivacion()] : null
      }`}
      tabIndex={0}
      mr={mr ?? 0}
      mt={mt ?? 1}
      p={p ?? 0.5}
      onKeyPress={event => event.key === "Enter" && !active && !alwaysInactive && activar(event)}
      onClick={!active && !alwaysInactive ? activar : null}
      onFocus={onFocus}
      maxWidth={maxWidth ? maxWidth : undefined}
      minWidth={minWidth ? minWidth : undefined}
    >
      {title && (focusStyle !== "button" || active) && (
        <Typography variant="overline">{title}</Typography>
      )}
      {/* {inactive
          ? children
          : activeSectionVariants[variant]
        } */}
      {collapsible ? (
        <>
          {inactive && children}
          <Collapse in={!inactive} mountOnEnter>
            {activeSectionVariants[variant]}
          </Collapse>
        </>
      ) : inactive ? (
        children
      ) : (
        activeSectionVariants[variant]
      )}
    </Box>
  );
}

// 
// 
export default QSection;
