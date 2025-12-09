export default parent => {
  return theme => {
    // const _p = parent(theme)
    return {
      // ..._p,
      paper8050: { minWidth: "80%", minHeight: "20%" },
      paper2020: { minWidth: "20%", minHeight: "20%" },
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
