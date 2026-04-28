import "./_forminput.css";
import { QBoton } from "./qboton.tsx";
import { QDate, QDateProps } from "./qdate.tsx";
import { Opcion } from "./qmulticheckbox.tsx";
import { QSelect } from "./qselect.tsx";

const opcionesIntervaloFechas: Opcion[][] = [
  [
    { valor: "grupo", descripcion: "Días" },
    { valor: "@hoy", descripcion: "Hoy" },
    { valor: "@ayer", descripcion: "Ayer" },
    { valor: "@mañana", descripcion: "Mañana" },
  ],
  [
    { valor: "grupo", descripcion: "Semanas" },
    { valor: "@esta-semana", descripcion: "Esta semana" },
    { valor: "@semana-anterior", descripcion: "Semana anterior" },
    { valor: "@semana-siguiente", descripcion: "Semana siguiente" },
  ],
  [
    { valor: "grupo", descripcion: "Meses" },
    { valor: "@este-mes", descripcion: "Este mes" },
    { valor: "@mes-anterior", descripcion: "Mes anterior" },
    { valor: "@mes-siguiente", descripcion: "Mes siguiente" },
  ],
  [
    { valor: "grupo", descripcion: "Años" },
    { valor: "@este-año", descripcion: "Este año" },
    { valor: "@año-anterior", descripcion: "Año anterior" },
    { valor: "@año-siguiente", descripcion: "Año siguiente" },
  ],
];

type QDateIntervalProps = QDateProps;

export const QDateInterval = ({
  label,
  nombre,
  valor,
  onChange,
  ...props
}: QDateIntervalProps) => {
  const manual = Array.isArray(valor);

  const manejarChangeIntervalo = (
    opcion: Opcion | null,
    e: React.ChangeEvent<HTMLElement>
  ) => {
    onChange?.(
      opcion?.valor ?? "",
      e as unknown as React.ChangeEvent<HTMLInputElement>
    );
  };

  const manejarChangeManual = () => {
    onChange?.(
      [undefined, undefined] as unknown as string,
      undefined as unknown as React.ChangeEvent<HTMLInputElement>
    );
  };

  if (!manual) {
    return (
      <>
        <QSelect
          label={label}
          nombre={nombre}
          valor={valor}
          onChange={manejarChangeIntervalo}
          opciones={opcionesIntervaloFechas}
        />
        <QBoton onClick={manejarChangeManual}>Manual</QBoton>
      </>
    );
  }

  const [desde, hasta] = valor as unknown as [string, string];

  const manejarChangeFecha = (
    v: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const clave = e.target.name.split("__")[1];

    const nuevoValor = [
      clave === "desde" ? v : desde,
      clave === "hasta" ? v : hasta,
    ] as [string, string];

    onChange?.(nuevoValor as unknown as string, e);
  };

  return (
    <div className="interval">
      <QDate
        {...props}
        label={label + " desde"}
        nombre={nombre + "__desde"}
        valor={desde}
        onChange={manejarChangeFecha}
      />
      <QDate
        {...props}
        label={label + " hasta"}
        nombre={nombre + "__hasta"}
        valor={hasta}
        onChange={manejarChangeFecha}
      />
    </div>
  );
};
