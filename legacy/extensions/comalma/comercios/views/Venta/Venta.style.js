export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      neutro: {
        backgroundColor: "inherit",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        // border: "1px solid blue",
        justifyContent: "flex-end",
        paddingLeft: theme.spacing(10),
        // width: "50%",
      },
    };
  };
};
