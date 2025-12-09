export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      iconoCabecera: {
        width: "40px",
        height: "40px",
        textAlign: "center",
        lineHeight: "40px",
        color: "white",
      },
      iconFolder: {
        color: `${theme.palette.grey[500]}`,
      },
      iconDocument: {
        color: `${theme.palette.primary.main}`,
      },
      cajaBusqueda: {
        margin: "10px 0px 5px 0px",
      },
      listElement: {
        "&:hover": {
          cursor: "pointer",
        },
        "padding": "5px 0px",
        "borderTop": `2px solid ${theme.palette.grey[300]}`,
      },
      elementSelected: {
        "&:hover": {
          cursor: "pointer",
        },
        "padding": "5px 0px",
        "borderTop": `2px solid ${theme.palette.grey[300]}`,
        "backgroundColor": `${theme.palette.grey[300]}`,
      },
      cabeceraBusqueda: {
        margin: "10px 0px 10px 0px",
        padding: "0px",
      },
    };
  };
};
