import { Box, Button, Field } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { useStateValue } from "quimera";

const useStyles = makeStyles(theme => ({
  botonera: {
    "display": "flex",
    "justifyContent": "space-between",
    "&:*": {
      flexGrow: 1,
    },
    "margin": "10px 0",
    "gap": "1em",
  },
  customDate: {
    textAlign: "right",
  },
  trimestreChecked: {
    color: "white",
    backgroundColor: "#505050",
  },
  trimestreUnchecked: {
    color: "#505050",
    backgroundColor: "transparent",
  },
}));

export default function ProgressButtons({ ...props }) {
  const [{ trimestres, flagCustomDate }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <>
      {flagCustomDate ? (
        <Box className={classes.botonera}>
          <Field.Date
            id="customDates.from"
            label="Desde"
            onChange={e =>
              dispatch({
                type: "onCustomDateChanged",
                payload: { field: "from", value: e.target.value },
              })
            }
          />
          <Field.Date
            id="customDates.to"
            label="Hasta"
            onChange={e =>
              dispatch({
                type: "onCustomDateChanged",
                payload: { field: "to", value: e.target.value },
              })
            }
          />
        </Box>
      ) : (
        <Box className={classes.botonera}>
          <Button
            id="t1"
            className={trimestres?.T1 ? classes.trimestreChecked : classes.trimestreUnchecked}
            onClick={() =>
              dispatch({
                type: "onTrimestreClicked",
                payload: { trimestre: "T1" },
              })
            }
          >
            T1
          </Button>
          <Button
            id="t2"
            className={trimestres?.T2 ? classes.trimestreChecked : classes.trimestreUnchecked}
            onClick={() =>
              dispatch({
                type: "onTrimestreClicked",
                payload: { trimestre: "T2" },
              })
            }
          >
            T2
          </Button>
          <Button
            id="t3"
            className={trimestres?.T3 ? classes.trimestreChecked : classes.trimestreUnchecked}
            onClick={() =>
              dispatch({
                type: "onTrimestreClicked",
                payload: { trimestre: "T3" },
              })
            }
          >
            T3
          </Button>
          <Button
            id="t4"
            className={trimestres?.T4 ? classes.trimestreChecked : classes.trimestreUnchecked}
            onClick={() =>
              dispatch({
                type: "onTrimestreClicked",
                payload: { trimestre: "T4" },
              })
            }
          >
            T4
          </Button>
        </Box>
      )}

      <Field.Switch id="flagCustomDate" className={classes.customDate} label="Personalizar fecha" />
    </>
  );
}
