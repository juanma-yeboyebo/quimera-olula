export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      error: {
        width: "60%",
        padding: "2%",
        backgroundColor: "white",
        boxShadow: "1px 1px 2px 2px grey",
        borderRadius: "25px",
      },
    };
  };
};
