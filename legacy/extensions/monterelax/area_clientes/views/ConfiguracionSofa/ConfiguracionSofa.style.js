export default parent => {
  return theme => {
    // const _p = parent(theme)
    return {
      paper5050: { minWidth: "50%", minHeight: "50%" },
      paper8050: { minWidth: "80%", minHeight: "50%" },
      paper8080: { minWidth: "80%", minHeight: "80%", maxWidth: "80%", maxHeight: "80%" },
      paper100100: { minWidth: "100%", minHeight: "100%" },
      cajaDropArea: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        padding: theme.spacing(3),
        border: "2px dashed lightgrey",
      },
      // ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
