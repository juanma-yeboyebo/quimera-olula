export default parent => {
  return theme => {
    const _p = parent(theme);
    const headerHeight = 47;

    return {
      ..._p,
      // container: {
      //   flexGrow: 1,
      //   minHeight: 500,
      //   paddingLeft: theme.spacing(7) + 1
      // }
      summary: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        pointerEvents: "none",
        listStyle: "none",
        fontSize: "1.7rem",
        lineHeight: "1.334",
        letterSpacing: "0em",
        color: theme.palette.primary.main,
        height: `${headerHeight}px`,
        // flexDirection: "row-reverse",
      },
    };
  };
};
