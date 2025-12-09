export const state = parent => ({
  ...parent,
});

export const bunch = parent => ({
  ...parent,
  onInitBufferPedidoSucceded_: [
    ...parent.onInitBufferPedidoSucceded_,
    {
      log: ({ idTrato }) => ["IDTRATO=", idTrato],
      type: "setStateKey",
      plug: ({ idTrato }) => ({ path: "pedido.buffer.idTrato", value: idTrato }),
    },
  ],
});
