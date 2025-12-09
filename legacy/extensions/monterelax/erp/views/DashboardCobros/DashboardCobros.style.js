export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      loading: {
        position: "absolute",
        width: "100%",
        height: "100%",
        textAlign: "center",
        backgroundColor: "black",
        top: 0,
        opacity: 0.5,
        color: "black",
      },
      lineChartv1: {
        marginLeft: "0%",
      },
      infoBoxv1: {
        overflow: "hidden",
        padding: 10,
        margin: 20,
        border: "1px solid lightgrey",
        borderRadius: 20,
        backgroundColor: "white",
        boxShadow: "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(76, 175, 80,.4)",
      },
    };
  };
};
