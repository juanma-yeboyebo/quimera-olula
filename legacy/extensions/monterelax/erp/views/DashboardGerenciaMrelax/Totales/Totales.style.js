export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      mediaContainer: {
        border: "1px solid darkslateblue",
        backgroundColor: "white",
        color: "black",
        width: "100%",
        borderRadius: 8,
        // marginLeft: 5,
        // marginBottom: 5,
        float: "left",
        // marginRight: 5,
        fontSize: 19,
        fontWeight: "normal",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: "normal",
        letterSpacing: "normal",
        padding: 0,
        height: 100,
        overflow: "hidden",
      },
      mediaContainerTitle: {
        // letterSpacing: 1.86,
        textTransform: "uppercase",
        height: 40,
        padding: 10,
        textAlign: "center",
      },
      mediaContainerValue: {
        height: 70,
        backgroundColor: "darkslateblue",
        color: "white",
        padding: 7,
        fontSize: 25,
        textAlign: "center",
      },
    };
  };
};
