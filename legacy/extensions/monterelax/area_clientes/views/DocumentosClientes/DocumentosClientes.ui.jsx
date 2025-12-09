import { Box, Container, Icon, IconButton, QBox, Typography } from "@quimera/comps";
import { TreeItem, TreeView } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

function DocumentosClientes({ useStyles }) {
  const [{ data, carpetaActual, list, documentoSeleccionado }, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  // const datos = {
  //   id: 'root',
  //   name: 'Parent',
  //   children: [
  //     {
  //       id: '1',
  //       name: 'Child - 1'
  //     },
  //     {
  //       id: '3',
  //       name: 'Child - 3',
  //       children: [
  //         {
  //           id: '4',
  //           name: 'Child - 4'
  //         }
  //       ]
  //     }
  //   ]
  // }

  const renderTree = nodes => (
    <TreeItem
      key={nodes.id}
      nodeId={String(nodes.id)}
      label={
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "4px" }}>
          {nodes.type === "dir" ? (
            <Icon className={classes.iconFolder}>folder</Icon>
          ) : (
            <Icon className={classes.iconDocument}>description</Icon>
          )}
          {
            <Typography variant="body2" style={{ flexGrow: 1, fontSize: "15px" }}>
              {nodes.name}
            </Typography>
          }
        </div>
      }
      onClick={
        nodes.type === "doc"
          ? () => {
            // dispatch({ type: 'onDescargarDocumento', payload: { nombreDocumentoSeleccionado: nodes.name, idDocumentoSeleccion: nodes.id } })
            dispatch({
              type: "onDocumentoSeleccionado",
              payload: {
                nombreDocumentoSeleccionado: nodes.name,
                idDocumentoSeleccion: nodes.id,
              },
            });
          }
          : () => {
            dispatch({ type: "onCarpetaClicked", payload: { carpeta: nodes } });
          }
      }
    >
      {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
    </TreeItem>
  );

  const icon = list ? "list" : "account_tree";
  const tree = !list;

  return (
    <Quimera.Template id="DocumentosClientes">
      <Container maxWidth="md" style={{ marginTop: "16px" }}>
        <QBox
          titulo="Mis documentos"
          botonesCabecera={
            [{ id: "modo", icon, disabled: false }]
            // <>
            //   <IconButton id='modo' color='white'>
            //     <Icon className={classes.iconoCabecera} ariaHidden={true}>
            //       {icon}
            //     </Icon>
            //   </IconButton>
            // </>
          }
        // botones={[
        //   {
        //     id: "download",
        //     icon: "cloud_download",
        //     disabled: util.isEmptyObject(documentoSeleccionado),
        //   },
        // ]}
        >
          <Box className={classes.cajaDownload}>
            <IconButton
              id="download"
              key="download"
              size="small"
              disabled={util.isEmptyObject(documentoSeleccionado)}
              title="Selecciona un documento y pulsa el botón para descargalo"
            >
              <Icon fontSize="large" className={classes.icon}>
                cloud_download
              </Icon>
            </IconButton>
            <Typography>Selecciona un documento y pulsa el botón para descargalo</Typography>
          </Box>

          {tree && (
            <TreeView
              defaultExpanded={["root"]}
              defaultCollapseIcon={<Icon style={{ color: "#959698" }}>arrow_drop_down</Icon>}
              defaultExpandIcon={<Icon style={{ color: "#959698" }}>arrow_right</Icon>}
              style={{ marginTop: "16px" }}
            // defaultCollapseIcon={<Icon>folder_open</Icon>}
            // defaultExpandIcon={<Icon>folder</Icon>}
            >
              {renderTree(data)}
            </TreeView>
          )}
          {list && <Quimera.SubView id="DocumentosClientes/ListaDocumentos" />}
        </QBox>
      </Container>
    </Quimera.Template>
  );
}

export default DocumentosClientes;
