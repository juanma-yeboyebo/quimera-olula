import { useRef } from "react";

type QInputMonedaProps = {
  nombre: string;
  valor: string | number;
  onChange: (valor: string, evento: React.ChangeEvent<HTMLElement>) => void;
  deshabilitado?: boolean;
  simbolo?: string;
};

export const QInputMoneda = ({
  nombre,
  valor,
  onChange,
  deshabilitado = false,
  simbolo = "€",
}: QInputMonedaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  let valorNumerico: string;
  if (typeof valor === "number") {
    valorNumerico = valor.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    const num = parseFloat(valor.replace(",", "."));
    valorNumerico = !isNaN(num)
      ? num.toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let nuevoValor = e.target.value.replace(simbolo, "").trim();
    if (!nuevoValor) nuevoValor = "0";
    nuevoValor = nuevoValor.replace(/[^0-9.,-]/g, "");
    onChange(nuevoValor, e);
  };

  const valorConSimbolo = `${valorNumerico} ${simbolo}`;

  return (
    <input
      ref={inputRef}
      type="text"
      name={nombre}
      value={valorConSimbolo}
      disabled={deshabilitado}
      onChange={handleChange}
      inputMode="decimal"
      style={{ textAlign: "right" }}
      onSelect={(e) => {
        const input = e.target as HTMLInputElement;
        const pos = input.selectionStart ?? 0;
        const max = valorConSimbolo.length - simbolo.length - 1;
        if (pos > max) {
          input.setSelectionRange(max, max);
        }
      }}
    />
  );
};
