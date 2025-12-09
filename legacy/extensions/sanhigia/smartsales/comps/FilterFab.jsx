import { Button, Fab, Icon } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ButtonGroup } from "@quimera/thirdparty";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
  filterFab: {
    position: "fixed",
    bottom: "145px",
    right: "7px",
    zIndex: "1100",
    color: "white",
    backgroundColor: theme.palette.grey[600],
    transition: "right 1s ease",
  },
  filterFabOpen: {
    right: "225px",
  },
  filterButtons: {
    position: "fixed",
    bottom: "140px",
    right: "25px",
    zIndex: "1000",
    height: "56px",
    width: "0px",
    overflow: "hidden",
    transition: "width 1s ease",
  },
  filterButtonsOpen: {
    display: "flex",
    width: "200px",
  },
  button: {
    "width": "50%",
    "backgroundColor": theme.palette.grey[600],
    "color": "white",
    "transform": "skew(-20deg)",
    "&>*": {
      transform: "skew(20deg)",
    },
  },
  // buttonTareas: {
  //   borderRadius: '30px 0 0 75px',
  // },
  // buttonTratos: {
  //   borderRadius: '0 75px 30px 0',
  // },
  inactiveButton: {
    color: theme.palette.grey[600],
    backgroundColor: "white",
  },
}));

export default function FilterFab({ onTratoFilterClicked, onTareaFilterClicked }) {
  const classes = useStyles();
  const [fabOpen, setFabOpen] = useState(false);
  const [tareaFilter, setTareaFilter] = useState(true);
  const [tratoFilter, setTratoFilter] = useState(true);

  const handleTratoFilter = () => {
    onTratoFilterClicked(!tratoFilter);
    setTratoFilter(!tratoFilter);
  };

  const handleTareaFilter = () => {
    onTareaFilterClicked(!tareaFilter);
    setTareaFilter(!tareaFilter);
  };

  let fabClasses = classes.filterFab;
  fabOpen && (fabClasses += ` ${classes.filterFabOpen}`);

  let buttonsClasses = classes.filterButtons;
  fabOpen && (buttonsClasses += ` ${classes.filterButtonsOpen}`);

  const classesTareas = `${classes.button} ${classes.buttonTareas} ${
    !tareaFilter ? classes.inactiveButton : ""
  }`;
  const classesTratos = `${classes.button} ${classes.buttonTratos} ${
    !tratoFilter ? classes.inactiveButton : ""
  }`;

  return (
    <>
      <Fab className={fabClasses} onClick={() => setFabOpen(!fabOpen)}>
        <Icon>filter_alt</Icon>
      </Fab>
      <ButtonGroup aria-label="outlined primary button group" className={buttonsClasses}>
        <Button id="FilterTratos" className={classesTratos} onClick={handleTratoFilter}>
          Tratos
        </Button>
        <Button id="FilterTareas" className={classesTareas} onClick={handleTareaFilter}>
          Tareas
        </Button>
      </ButtonGroup>
    </>
  );
}
