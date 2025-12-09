import { Box, Grid } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function Totales({ tipo, useStyles }) {
  const [
    {
      mediaFabricadas,
      mediaRetrasoSalida,
      mediaDiasServicio,
      totalPedidas,
      totalFabricadas,
      mediaPiezasPedidas,
      mediaPiezasFabricadas,
      mediaImportePiezasPedidas,
      mediaImportePiezasFabricadas,
      mediaMetrosCortados,
      mediaMetrosPedidos,
      totalCortadas,
      totalCosidas,
      totalRevestidas,
      mediaPiezasCortadas,
      mediaPiezasCosidas,
      mediaPiezasRevestidas,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();

  const gerencia = tipo === "gerencia";

  return (
    <Quimera.Template id="Totales">
      <Grid container spacing={1}>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Piezas pedidas</div>
            <div className={classes.mediaContainerValue}> {totalPedidas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Piezas Fabricadas</div>
            <div className={classes.mediaContainerValue}> {totalFabricadas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media Piezas Pedidas</div>
            <div className={classes.mediaContainerValue}> {mediaPiezasPedidas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media Piezas Fabricadas</div>
            <div className={classes.mediaContainerValue}> {mediaPiezasFabricadas}</div>
          </Box>
        </Grid>
        {gerencia && (
          <Grid item xs={6} sm={6} md={3} lg={2}>
            <Box component="div" className={classes.mediaContainer}>
              <div className={classes.mediaContainerTitle}>Media importe pedidas</div>
              <div className={classes.mediaContainerValue}> {mediaImportePiezasPedidas} €</div>
            </Box>
          </Grid>
        )}
        {gerencia && (
          <Grid item xs={6} sm={6} md={3} lg={2}>
            <Box component="div" className={classes.mediaContainer}>
              <div className={classes.mediaContainerTitle}>Media importe fabricadas</div>
              <div className={classes.mediaContainerValue}> {mediaImportePiezasFabricadas} €</div>
            </Box>
          </Grid>
        )}
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Días retraso Fabricación</div>
            <div className={classes.mediaContainerValue}> {mediaFabricadas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Días retraso envío</div>
            <div className={classes.mediaContainerValue}> {mediaRetrasoSalida}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media días de servicio</div>
            <div className={classes.mediaContainerValue}> {mediaDiasServicio}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media metros pedidos</div>
            <div className={classes.mediaContainerValue}> {mediaMetrosPedidos}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media metros cortados</div>
            <div className={classes.mediaContainerValue}> {mediaMetrosCortados}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Piezas Cortadas</div>
            <div className={classes.mediaContainerValue}> {totalCortadas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Piezas Cosidas</div>
            <div className={classes.mediaContainerValue}> {totalCosidas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Piezas Revestidas</div>
            <div className={classes.mediaContainerValue}> {totalRevestidas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media Piezas Cortadas</div>
            <div className={classes.mediaContainerValue}> {mediaPiezasCortadas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media Piezas Cosidas</div>
            <div className={classes.mediaContainerValue}> {mediaPiezasCosidas}</div>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2}>
          <Box component="div" className={classes.mediaContainer}>
            <div className={classes.mediaContainerTitle}>Media Piezas Revestidas</div>
            <div className={classes.mediaContainerValue}> {mediaPiezasRevestidas}</div>
          </Box>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default Totales;
