export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      cajaInfo: {
        borderRadius: 4,
        marginRight: 0.5,
        fontSize: "1rem",
        fontWeight: "bold",
        padding: "2px 10px 2px 10px",
        color: "black",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "fit-content",
      },
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
    };
  };
};
