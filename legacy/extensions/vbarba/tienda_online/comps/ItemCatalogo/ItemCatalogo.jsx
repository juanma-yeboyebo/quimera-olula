import "./ItemCatalogo.style.scss";

import { SelectorValores } from "@quimera-extension/base-almacen";
import { Box, Button, Collapse, Dialog, DialogTitle, Grid, Icon, IconButton } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Divider, Typography, useTranslation } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import { useState } from "react";

import {
  colores,
  noImage,
  resistenciasHumedad,
  resistenciasSalinidad,
  resistenciasSol,
} from "../../static/local";
import ItemReferencia from "./ItemCatalogoReferencia";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  divider: {
    borderBottomWidth: 5,
  },
  dividerReferencias: {
    backgroundColor: "rgba(0, 0, 0, 0.30)",
    marginTop: "5px",
  },
  colores: {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 5,
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const refsVisibiles = 2;

// async function wiki(nombrePlanta) {
//   const url = `https://es.wikipedia.org/w/api.php?format=json&action=query&generator=search&prop=url&prop=extracts&origin=*&exintro&explaintext&exsentences=1&gsrlimit=1&gsrsearch=${nombrePlanta}`;
//   const res = await fetch(url);
//   const data = await res.json();

//   const searchResults = document.querySelector(".js-search-results");
//   const result = data.query?.pages[Object.keys(data.query.pages)[0]];
//   if (result) {
//     const urlWiki = `https://es.wikipedia.org/?curid=${result.pageid}`;
//     searchResults.insertAdjacentHTML(
//       "beforeend",
//       `<div class="result-item">
//         <span class="result-extract">${result.extract}</span><br>
//         <a href="${urlWiki}" class="result-link" target="_blank" rel="noopener">${urlWiki}</a>
//       </div>`,
//     );
//   }
// }

function ItemCatalogo({ renderAvatar, model, modelName, selected = false, ...props }) {
  const producto = model;
  const baseImageUrl = "http://barnaplant.com/imagenes/disponible";
  const classes = useStyles();
  // const [cantidad, setCantidad] = useState(1);
  const [enDetalle, setEnDetalle] = useState(false);
  // const [wikiPage, setWikiPage] = useState("Cargando...");
  const urlImage = producto.tieneFoto
    ? `${baseImageUrl}/${producto.grupoPlanta}.JPG`
    : producto.urlImagenAlt
      ? producto.urlImagenAlt
      : noImage;
  // const grupo_portada = 'return (state.articulo.data.nombre1).substring(0,3).toUpperCase() + state.articulo.data.nombre2.substring(0,3).toUpperCase()'
  // const [urlImage, setUrlImage] = useState(`${baseImageUrl}/${producto.grupoPlanta}.JPG`);
  const [referenciaImagen, setReferenciaImagen] = useState(producto["referencias"][0].referencia);
  const [cajonAbierto, setCajonAbierto] = useState(false);
  // const [validation, setValidation] = useState({ error: false, helperText: "" });
  const [{ soloDisponibles }] = useStateValue();
  // const [{ carrito }] = useAppValue();
  const guest = util.getUser().user === "guest";
  const { t } = useTranslation();
  // console.log(model);

  if (!model) {
    return null;
  }

  if (soloDisponibles && model.referencias?.filter(articulo => articulo.disponible).length == 0) {
    return null;
  }

  const coloresPlanta = colores.filter(color => model.color?.search(color.value) >= 0);

  // const handleChangeCantidad = e => {
  //   setValorCantidad(e.floatValue);
  // };

  // const handleSumaClicked = c => {
  //   const multiplo = 1;
  //   setValorCantidad(cantidad + c * multiplo);
  // };

  // const setValorCantidad = c => {
  //   c > 0 ? setCantidad(c) : setCantidad(0);
  // };

  const handleAbrirCajonClicked = () => {
    setCajonAbierto(!cajonAbierto);
  };

  const listaDeReferencias = (indiceMin, indiceMax) => {
    const referencias = indiceMax
      ? model.referencias.slice(indiceMin, indiceMax)
      : model.referencias;

    return referencias
      .filter(articulo => (soloDisponibles ? articulo?.disponible : true))
      .map(articulo => (
        <>
          <ItemReferencia key={articulo.referencia} model={articulo} />
          <Divider className={classes.dividerReferencias} />
        </>
      ));
  };

  function TextoConIcono({ children, icon, iconStyle = {} }) {
    return (
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <Icon style={{ fontSize: 30, ...iconStyle }}>{icon}</Icon>
        <Typography variant="body">{children}</Typography>
      </Box>
    );
  }

  const handleClick = e => {
    setEnDetalle(true);
    // wiki(producto["nombre"].replace(/['"]+/g, ""));
  };
  const handleCerrarDetalle = e => {
    setEnDetalle(false);
  };
  const onReferenciaModalChanged = referencia => {
    setReferenciaImagen(referencia);
  };

  const dameNombreArt = articulo => {
    if (articulo.nombre3 == "" && articulo.nombre4 == "") {
      return `${producto["nombre"] + articulo.litraje} ${articulo?.forma} ${articulo?.altura} ${articulo?.perimetro
        }`;
    }

    return `${producto["nombre"] + articulo.nombre3} ${articulo.nombre3} ${articulo.nombre4} ${articulo.litraje
      } ${articulo?.forma} ${articulo?.altura} ${articulo?.perimetro}`;
  };

  const width = 250;
  const height = 284 + refsVisibiles * (guest ? 45 : 80);
  const referenciasSelectValues = producto["referencias"].map(articulo => {
    return {
      key: articulo.referencia,
      value: dameNombreArt(articulo),
    };
  });

  // wiki(producto["nombre"].replace(/['"]+/g, ''));
  // const tiposComercio = [
  //   { key: "Restauracion", value: "Restauración" },
  //   { key: "Comercio", value: "Comercio" },
  // ];

  return (
    <Grid item key={modelName}>
      <Box m={1}>
        <Box
          minWidth={width}
          maxWidth={width}
          minHeight={height}
          border={2}
          borderColor="gray"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Box
              border={0}
              borderColor="blue"
              style={{ overflow: "hidden", backgroundColor: "white" }}
              display="flex"
              justifyContent="center"
              width={1}
            >
              <img
                src={urlImage}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                height={200}
                alt={model.nombre}
                loading="lazy"
                onClick={handleClick}
              />
            </Box>
            <Box p={1}>
              <Typography variant="body1">{model.nombre}</Typography>
            </Box>
          </Box>
          <Box width={1}>
            <Divider className={classes.dividerReferencias} />
            {model.referencias.length <= refsVisibiles ? (
              listaDeReferencias()
            ) : (
              <>
                {listaDeReferencias(0, refsVisibiles)}
                <Button
                  id="abrirCajon"
                  variant="text"
                  color="secondary"
                  text={t(cajonAbierto ? "itemCatalogo.menosTamanos" : "itemCatalogo.masTamanos")}
                  onClick={handleAbrirCajonClicked}
                />
                <Collapse in={cajonAbierto} appear={cajonAbierto}>
                  {listaDeReferencias(refsVisibiles, model.referencias.length)}
                </Collapse>
              </>
            )}
          </Box>
          {enDetalle && (
            <Dialog open={enDetalle} maxWidth="md">
              <DialogTitle>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" width={0.8}>
                    <SelectorValores
                      id="referenciasModal"
                      valores={referenciasSelectValues}
                      value={referenciaImagen}
                      arrayKeyValue
                      fullWidth
                      callbackChanged={onReferenciaModalChanged}
                    ></SelectorValores>
                  </Box>
                  {/* {model.nombre} */}
                  {/* {model.alturaMax} */}
                  <IconButton id="cerrarDetalle" size="small" onClick={handleCerrarDetalle}>
                    <Icon>close</Icon>
                  </IconButton>
                </Box>
              </DialogTitle>
              <Box display="flex" pb={2} px={2} className="ItemCatalogoBody">
                <Box
                  border={0}
                  borderColor="blue"
                  style={{ overflow: "hidden", backgroundColor: "white" }} display="flex"
                  justifyContent="center"
                  width={1}
                  className="ItemCatalogoBodyImagen"
                >
                  <img
                    src={`${baseImageUrl}/${referenciaImagen}.JPG`}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = noImage;
                    }}
                    height={300}
                    alt={model.nombre}
                    loading="lazy"
                  />
                </Box>
                <Box pl={2} className="ItemCatalogoBodyTexto">
                  <Typography variant="h7">{t("itemCatalogo.medidas")}</Typography>
                  <Divider className={classes.divider} />
                  <TextoConIcono icon="height" iconStyle={{ transform: "rotate(90deg)" }}>
                    {model.anchuraMin} - {model.anchuraMax} cm
                  </TextoConIcono>
                  <TextoConIcono icon="height" pb={1}>
                    {model.alturaMin} - {model.alturaMax} cm
                  </TextoConIcono>
                  <Box pb={1} />
                  <Typography variant="h7">{t("itemCatalogo.caracteristicas")}</Typography>
                  <Divider className={classes.divider} />
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <TextoConIcono icon="thermostat">
                      {model.tempMin} - {model.tempMax} ºC
                    </TextoConIcono>
                    <Box display="flex" alignItems="center" justifyContent="flex-start">
                      {coloresPlanta.map(color => (
                        <Icon key={color.value} style={{ color: color.rgb, fontSize: 30 }}>
                          filter_vintage
                        </Icon>
                      ))}
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <TextoConIcono icon="water_drop">
                      {`${t("itemCatalogo.humedad")}: ${t(
                        resistenciasHumedad.find(e => (e.key = model.resHumedad))?.value,
                      )}`}
                    </TextoConIcono>
                    <TextoConIcono icon="sunny">
                      {t(resistenciasSol.find(e => (e.key = model.exposicionSolar))?.value)}
                    </TextoConIcono>
                    <TextoConIcono icon="grass">
                      {`${t("itemCatalogo.salinidad")}: ${t(
                        resistenciasSalinidad.find(e => (e.key = model.resSalinidad))?.value,
                      )}`}
                    </TextoConIcono>
                  </Box>
                  <Box pb={1} />
                  <Typography variant="h7">{t("itemCatalogo.descripcion")}</Typography>
                  <Divider className={classes.divider} />
                  {/* <div class="js-search-results" style={{ marginTop: "5px" }} /> */}
                  <Typography>{model.descripcionPlanta}</Typography>
                </Box>
              </Box>
            </Dialog>
          )}
        </Box>
      </Box>
    </Grid>
  );
}

export default ItemCatalogo;
