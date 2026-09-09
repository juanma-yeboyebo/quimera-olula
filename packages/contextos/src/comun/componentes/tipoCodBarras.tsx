import { opcionesTipoCodBarras } from "#/valores/codbarras.ts";
import { QSelect, QSelectProps } from "@olula/componentes/atomos/qselect.tsx";

type TipoCodBarrasProps = Omit<QSelectProps, "opciones" | "label" | "nombre"> & {
  valor: string;
  label?: string;
  nombre?: string;
};

export const TipoCodBarras = ({
  valor,
  label = "Tipo cód. barras",
  nombre = "tipoCodBarras",
  ...props
}: TipoCodBarrasProps) => {
  return (
    <QSelect
      {...props}
      label={label}
      nombre={nombre}
      valor={valor}
      opciones={opcionesTipoCodBarras}
    />
  );
};
