export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      leftIcon: {
        marginRight: theme.spacing(1),
      },
      seccion: {
        "border": `2px solid ${theme.palette.grey[200]}`,
        "paddingLeft": theme.spacing(0.5),
        "borderRadius": theme.spacing(0.5),
        "marginTop": theme.spacing(1),
        // border: `2px solid ${theme.palette.primary.light}`,
        "height": 55,
        "boxSizing": "border-box",
        "&:focus-within": {
          border: `2px solid ${theme.palette.primary.light}`,
          paddingLeft: theme.spacing(0.5),
          borderRadius: theme.spacing(0.5),
          // boxSizing: 'border-box'
        },
      },
      div: {
        "&:focus-within": {
          outline: "none",
        },
      },
    };
  };
};
