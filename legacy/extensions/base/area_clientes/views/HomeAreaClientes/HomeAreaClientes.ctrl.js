export const state = parent => ({
  ...parent,
});

// export const ctrl = parent => (
//   class core extends parent {
//     // onCancelarModalClicked (state, payload) {
//     //   return this.setState({
//     //     ...state,
//     //     saved: true
//     //   })
//     // }
//   }
// )

export const bunch = parent => {
  return {
    ...parent,
  };
};
