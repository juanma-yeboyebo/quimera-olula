export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      avatar: {
        backgroundColor: `${theme.palette.success.main}`,
      },
      success: {
        color: `${theme.palette.success.main}`,
        // color: `green`,
      },
      error: {
        color: `${theme.palette.error.main}`,
      },
      horasParte: {
        color: "grey",
      },
      textoUnaLinea: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
      },
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
