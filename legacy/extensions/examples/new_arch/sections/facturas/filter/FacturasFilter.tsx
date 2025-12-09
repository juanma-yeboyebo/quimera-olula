import { useFacturasFilter } from "./useFacturasFilter";

export const FacturasFilter = () => {
  const { onSubmit } = useFacturasFilter();

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="codigo">Código</label>
      <input type="text" id="codigo" name="codigo" />
      <input type="submit" value="Filtrar" />
    </form>
  );
};
