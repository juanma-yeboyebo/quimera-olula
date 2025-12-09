export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      tituloPaginaActualDesktop: {
        color: theme.palette.secondary.main,
        fontSize: 24,
        // fontFamiliy: 'Rubik',
        fontWeight: 420,
        paddingTop: 6,
        marginBottom: 8,
        // marginRight: 8,
        marginLeft: 15,
      },
      tituloPaginaActualMobile: {
        color: theme.palette.secondary.main,
        fontSize: 18,
        fontWeight: 420,
        // paddingTop: 6,
        // marginBottom: 6,
        marginLeft: 8,
      },

      // container: {
      //   color: theme.palette.primary.main
      // }
    };
  };
};
