export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        marginTop: 12,
      },
      mobileBox: {
        width: "40px",
        height: "40px",
        borderRadius: "4px",
        color: "#ffff",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold",
        margin: "0px 8px 0px 4px",
      },
      yellowBox: {
        backgroundColor: theme.palette.warning.main,
      },
      greenBox: {
        backgroundColor: theme.palette.success.main,
      },
      button: {
        margin: "0px 20px",
      },
      boldBox: {
        fontWeight: "bold",
      },
    };
  };
};
