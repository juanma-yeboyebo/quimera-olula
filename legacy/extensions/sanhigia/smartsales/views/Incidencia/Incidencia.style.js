export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      icon: {
        "color": theme.custom.menu.alternative,
        "transition": "all .2s ease-in-out",
        "&:hover": {
          color: theme.custom.menu.accent,
          transform: "scale(1.2)",
        },
      },
      link: {
        "color": "#000",
        "textDecoration": "none",
        "transition": "all .4s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          cursor: "pointer",
        },
      },
    };
  };
};
