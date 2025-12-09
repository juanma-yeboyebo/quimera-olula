export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      referencia: {
        flexGrow: 1,
        marginRight: theme.spacing(1),
      },
      cantidad: {
        maxWidth: 80,
        marginRight: theme.spacing(1),
      },
      icon: {
        "color": theme.custom.menu.alternative,
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: theme.custom.menu.accent,
          transform: "scale(1.2)",
        },
      },
      field: {
        width: "100%",
      },
    };
  };
};
