export const state = parent => ({
  ...parent,
  drawerAbierto: false,
});

export const ctrl = parent =>
  class dailyjob extends parent {
    init(state, payload) {
      return this.setState({
        ...state,
      });
    }

    onAbrirDrawerClicked(state, payload) {
      return this.setState({
        ...state,
        drawerAbierto: payload.data.abierto,
      });
    }
  };
