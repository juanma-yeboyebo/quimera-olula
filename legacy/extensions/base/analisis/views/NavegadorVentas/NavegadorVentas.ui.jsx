import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@quimera/comps";
import Quimera, { getSchemas, navigate, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";
import { DataFrameTable, FieldOptionMultiSelect } from "../../comps";

function NavegadorVentas({ useStyles }) {
  const schema = getSchemas().dataframe;
  const [
    {
      data,
      configuracionVisible,
      ventasFilter,
      medidas,
      nivelesX,
      nivelesY,
      medidasAux,
      nivelesXAux,
      nivelesYAux,
      sumX
    },
    dispatch,
  ] = useStateValue();
  const width = useWidth();
  const classes = useStyles();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  const dataConfiguracion = {
    medidas: {
      id: "medidas",
      title: "medidas",
      items: medidasAux,
      itemsMostrados: medidas,
      schema: getSchemas().dataframe,
      onConfirm: () => dispatch({ type: "onConfiguracionVisibleConfirmed" }),
      onCancel: () => dispatch({ type: "onConfiguracionVisibleCancelled" }),
    },
    nivelesX: {
      id: "nivelesX",
      title: "eje X",
      items: nivelesXAux,
      itemsMostrados: nivelesX,
      schema: getSchemas().dataframe,
      onConfirm: () => dispatch({ type: "onConfiguracionVisibleConfirmed" }),
      onCancel: () => dispatch({ type: "onConfiguracionVisibleCancelled" }),
    },
    nivelesY: {
      id: "nivelesY",
      title: "eje Y",
      items: nivelesYAux,
      itemsMostrados: nivelesY,
      schema: getSchemas().dataframe,
      onConfirm: () => dispatch({ type: "onConfiguracionVisibleConfirmed" }),
      onCancel: () => dispatch({ type: "onConfiguracionVisibleCancelled" }),
    },
  };

  return (
    <Quimera.Template id="NavegadorVentas">
      <Box className="NavegadorVentas">
        <Button id="backToDashboard" onClick={() => navigate("/")}>
          Volver
        </Button>
        <Box display="flex" justifyContent="space-around" className="NavegadorVentasBox">
          <Box width={0.4} className="NavegadorVentasFiltros">
            <Box display={"flex"} justifyContent={"space-between"}>
              {Object.values(dataConfiguracion).map(conf => (
                <>
                  <Button
                    id={`seleccionar${util.capitalize(conf.id)}`}
                    color="primary"
                    onClick={() =>
                      dispatch({
                        type: `onMostrarModalConfiguracionClicked`,
                        payload: { tipo: conf.id },
                      })
                    }
                  >
                    {util.capitalize(conf.title)}
                  </Button>
                  {(conf.itemsMostrados ?? []).map((item, idx) => (
                    <>{item?.value}</>
                  ))}
                </>
              ))}
            </Box>

            <Quimera.SubView id="NavegadorVentas/VentasFiltros" />
          </Box>
          <Box width={anchoDetalle} className="NavegadorHtml">
            {/* <div dangerouslySetInnerHTML={{ __html: table }} /> */}
            <DataFrameTable id="cubo" data={data} sumX={sumX} />

          </Box>
        </Box>
      </Box>

      {!!configuracionVisible && (
        <Dialog open={true} classes={{ paper: classes.paperAuto80 }}>
          <DialogTitle id="form-dialog-title">
            {`Configuracion ${dataConfiguracion[configuracionVisible]["title"]}`}
          </DialogTitle>
          <DialogContent>
            <FieldOptionMultiSelect
              id={dataConfiguracion[configuracionVisible]["id"]}
              schema={dataConfiguracion[configuracionVisible]["schema"]}
              items={dataConfiguracion[configuracionVisible]["items"]}
            />
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="space-between">
              <Button
                id="concelar"
                text="CANCELAR"
                variant="text"
                color="secondary"
                onClick={dataConfiguracion[configuracionVisible]["onCancel"]}
              />
              <Button
                id="confirmar"
                text="CONFIRMAR"
                variant="text"
                color="primary"
                onClick={dataConfiguracion[configuracionVisible]["onConfirm"]}
              />
            </Grid>
          </DialogActions>
        </Dialog>
      )}
    </Quimera.Template>
  );
}

export default NavegadorVentas;
