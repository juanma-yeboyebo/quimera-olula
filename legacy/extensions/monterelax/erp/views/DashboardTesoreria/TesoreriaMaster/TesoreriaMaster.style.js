export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      element: {
        backgroundColor: "white",
      },
      verde: {
        color: "green",
      },
      rojo: {
        color: "red",
      },
      gris: {
        color: "grey",
      },
      flechaAbajo: {
        color: "red",
        fontWeight: "bold",
      },
      flechaArriba: {
        color: "green",
        fontWeight: "bold",
      },
    };
  };
};
