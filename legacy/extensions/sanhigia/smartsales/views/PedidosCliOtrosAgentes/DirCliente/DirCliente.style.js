export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      seccion: {
        "marginTop": theme.spacing(1),
        "border": `2px solid ${theme.palette.grey[200]}`,
        // paddingLeft: theme.spacing(0.5),
        "borderRadius": theme.spacing(0.5),
        "padding": theme.spacing(0.5),
        "cursor": "pointer",
        // border: `2px solid ${theme.palette.primary.light}`,
        //  height: 55,
        "boxSizing": "border-box",
        "&:focus-within": {
          border: `2px solid ${theme.palette.primary.light}`,
          paddingRight: theme.spacing(0.5),
          paddingLeft: theme.spacing(0.5),
          borderRadius: theme.spacing(0.5),
          outline: "none",
          // boxSizing: 'border-box'
        },
        "&:hover": {
          border: `2px solid ${theme.palette.primary.light}`,
          paddingRight: theme.spacing(0.5),
          paddingLeft: theme.spacing(0.5),
          borderRadius: theme.spacing(0.5),
          outline: "none",
          // boxSizing: 'border-box'
        },
      },
      seccionActivada: {
        // position: 'relative',
        // left: -30,
        // zIndex: 1000,
        overflow: "visible",
        marginTop: theme.spacing(1),
        border: `2px solid ${theme.palette.primary.light}`,
        padding: theme.spacing(0.5),
        borderRadius: theme.spacing(0.5),
        outline: "none",
      },
    };
  };
};
