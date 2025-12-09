export default parent => {
  return theme => {
    // const _p = parent(theme)
    return {
      paper2040: { minWidth: "20%", minHeight: "40%" },
      paper5050: { minWidth: "50%", minHeight: "50%" },
      paper8050: { minWidth: "80%", minHeight: "50%" },
      paper100100: { minWidth: "100%", minHeight: "100%" },
      // ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
