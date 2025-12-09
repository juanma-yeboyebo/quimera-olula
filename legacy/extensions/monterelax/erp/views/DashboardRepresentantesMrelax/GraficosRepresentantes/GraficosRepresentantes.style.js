export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      mediaContainerv1: {
        border: "1px solid darkslateblue",
        backgroundColor: "white",
        color: "black",
        // width: '48%',
        // marginLeft: '32%',
        borderRadius: 8,
        marginBottom: 5,
        marginRight: 5,
        fontSize: 19,
        fontWeight: "normal",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: "normal",
        letterSpacing: "normal",
        padding: 0,
        overflow: "hidden",
      },
      mediaContainerTitlev1: {
        letterSpacing: 1.86,
        textTransform: "uppercase",
        textAlign: "center",
        position: "relative",
        float: "left",
        width: "60%",
      },
      mediaContainerValuev1: {
        backgroundColor: "darkslateblue",
        color: "white",
        fontSize: 25,
        textAlign: "center",
        position: "relative",
        float: "left",
        width: "40%",
      },
    };
  };
};
