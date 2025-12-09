import { Box, Icon } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { useStateValue } from "quimera";

import { CollapsibleBox, ProgressButtons } from "./";

const useStyles = makeStyles(theme => ({
  boxProgreso: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0",
  },
  progresoPercent: {
    display: "flex",
    alignItems: "center",
    gridColumn: "1",
    gridRow: "1 / 5",
    fontSize: "4.5rem",
    fontWeight: "700",
    textAlign: "center",
  },
  boxIncrement: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1em",
  },
  boxData: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  progresoSubtitle: {
    width: "100%",
    textAlign: "right",
  },
  progresoData: {
    width: "100%",
    height: "25px",
    textAlign: "right",
    fontSize: "1.4rem",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  incrementIcon: {
    fontSize: "2.5rem",
    marginRight: "-7.5px",
    fontWeight: "bold",
  },
  positive: {
    color: "green",
    transform: "scaleX(0.6) translateY(2px)",
  },
  negative: {
    transform: "scaleX(0.6) translateY(-1px) rotateX(180deg)",
    color: "red",
  },
  collapseData: {
    textAlign: "left",
    fontSize: "1.4rem",
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  },
}));

export default function Progress({ ...props }) {
  const [{ previsiones, trimestres }] = useStateValue();
  const classes = useStyles();
  const triArr = Object.keys(trimestres).filter((val, i) => (trimestres[val] == true ? val : false));
  // const tri = trimestres.filter(tri => tri);
  if (!previsiones?.totalVentas) {
    return;
  }

  // const totalVentasResumido = parseFloat(previsiones?.totalVentasResumido.substring(0, previsiones?.totalVentas.length - 2));
  // console.log(totalVentasResumido + "K €");
  const totalVentasResumido = previsiones?.totalVentasResumido;
  return (
    <CollapsibleBox
      title="Progreso"
      className={classes.box}
      collapsible={false}
      collapseContent={
        <Box className={classes.boxProgreso}>
          <Box style={{ maxWidth: "100px", marginTop: "5px" }}>
            {triArr.map(trimestre => <span className={classes.collapseData}>{trimestre}</span>)}
          </Box>

          <span className={classes.collapseData}>{previsiones.percent}%</span>
          <span className={`${classes.collapseData}`}>{totalVentasResumido}</span>
          <span className={classes.collapseData}>
            <Icon
              className={`${classes.incrementIcon} ${parseFloat(previsiones.increment) > -0.00000001
                ? classes.positive
                : classes.negative
                }`}
            >
              arrow_drop_up
            </Icon>
            {previsiones.increment}%
          </span>
        </Box>
      }
      {...props}
    >
      <ProgressButtons />
      <Box className={classes.boxProgreso}>
        <span className={classes.progresoPercent}>{previsiones.percent}%</span>
        <Box className={classes.boxIncrement}>
          <Box className={classes.boxData}>
            <span className={classes.progresoSubtitle}>Total ventas</span>
            <span className={`${classes.progresoData}`}>{previsiones.totalVentas}</span>
          </Box>
          <Box className={classes.boxData}>
            <span className={classes.progresoSubtitle}>Incremento/año</span>
            <span className={classes.progresoData}>
              <Icon
                className={`${classes.incrementIcon} ${parseFloat(previsiones.increment) > -0.00000001
                  ? classes.positive
                  : classes.negative
                  }`}
              >
                arrow_drop_up
              </Icon>
              {previsiones.increment}%
            </span>
          </Box>
          {/* <span className={classes.progresoSubtitle}>Previsión</span>
          <span className={classes.progresoData}>112'5%</span> */}
        </Box>
      </Box>
    </CollapsibleBox>
  );
}
