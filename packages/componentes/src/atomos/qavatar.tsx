import "./qavatar.css";

interface QAvatarProps {
  nombre: string;
  tamaño?: "sm" | "md" | "lg";
}

export const QAvatar = ({ nombre, tamaño = "md" }: QAvatarProps) => {
  const obtenerIniciales = (nombre: string) => {
    const palabras = nombre.trim().split(" ");

    if (palabras.length >= 2) {
      // Si hay 2 o más palabras, tomamos la primera letra de las dos primeras
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    } else {
      // Si solo hay una palabra, tomamos las dos primeras letras
      return nombre.slice(0, 2).toUpperCase();
    }
  };

  return <div className={`q-avatar ${tamaño}`}>{obtenerIniciales(nombre)}</div>;
};
