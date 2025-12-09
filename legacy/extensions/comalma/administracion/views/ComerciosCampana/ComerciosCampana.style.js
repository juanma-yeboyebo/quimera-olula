export default parent => {
  return theme => {
    // const _p = parent(theme)
    return {
      // ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
      iconoCabecera: {
        "color": theme.palette.primary.dark,
        "pointerEvents": "initial",
        "transition": "all .2s ease-in-out",
        "&$disabled": {
          color: "lightgrey",
        },
        "&:hover": {
          color: theme.palette.action.hover,
          transform: "scale(1.2)",
          fontWeight: "bold",
        },
        "&:active": {
          color: theme.palette.action.active,
        },
      },
    };
  };
};
