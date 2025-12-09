export default parent => {
  return theme => {
    // const _p = parent(theme)
    return {
      paper5050: { minWidth: "50%", minHeight: "50%" },
      paper8050: { minWidth: "80%", minHeight: "50%" },
      paper100100: { minWidth: "100%", minHeight: "100%" },
      paper5080: { minWidth: "50%", minHeight: "80%" },
      paperAuto80: { minWidth: "auto", minHeight: "80%" },
      // ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
