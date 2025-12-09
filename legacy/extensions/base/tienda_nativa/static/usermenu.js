export default parent => ({
  ...parent,
  session: {
    ...parent.session,
    items: {
      ...parent.session.items,
      // loginCustomer: {
      //   title: 'Conectar',
      //   icons: ['exit_to_app'],
      //   url: '/login/customer'
      // },
    },
  },
});
