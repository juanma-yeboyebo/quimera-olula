import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";
import { getTiposCaja } from "../../tipo_caja/infraestructura.ts";

type TipoCajaProps = Omit<QAutocompletarProps, "obtenerOpciones" | "label"> & { label?: string };

type OpcionTipoCaja = {
  valor: string;
  descripcion: string;
};

export const TipoCaja = ({
  valor,
  nombre = "codtipocaja",
  label = "Tipo de caja",
  onChange,
  ...props
}: TipoCajaProps) => {
  const [opciones, setOpciones] = useState<OpcionTipoCaja[]>([]);

  useEffect(() => {
    getTiposCaja({} as unknown as Criteria).then(({ datos }) =>
      setOpciones(datos.map((t) => ({ valor: t.id, descripcion: t.descripcion })))
    );
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opciones}
      {...props}
    />
  );
};
