export default parent => {
  return theme => {
    // const _p = parent(theme)
    return {
      paper5050: { minWidth: "50%", minHeight: "50%" },
      paper8050: { minWidth: "100%", minHeight: "100%" },
      // ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
