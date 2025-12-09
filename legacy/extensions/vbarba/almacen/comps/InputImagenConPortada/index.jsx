import { Box, Button, Icon, Typography } from "@quimera/comps";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@quimera/thirdparty";
import React, { useRef, useState } from "react";

function InputImagenConPortada({
  tieneFoto = false,
  onImagenChange,
  onVerImagen,
  textoBoton,
  disabled = false,
}) {
  const inputRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [esPortadaTemp, setEsPortadaTemp] = useState(false); // Siempre inicia en false

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const archivo = files[0];
      setImagenSeleccionada(archivo);

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(archivo);

      // Auto-marcar como portada si no hay imagen previa
      setEsPortadaTemp(!tieneFoto);

      // Abrir modal de confirmación
      setModalOpen(true);
    }
  };

  const handleConfirmar = () => {
    if (imagenSeleccionada && onImagenChange) {
      onImagenChange([imagenSeleccionada], esPortadaTemp);
    }
    handleCerrarModal();
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setImagenSeleccionada(null);
    setPreviewUrl(null);
    setEsPortadaTemp(false); // Reset a false
    // Limpiar el input para poder seleccionar el mismo archivo otra vez
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Botón para ver imagen  */}
      <Button
        id="verImagen"
        variant="contained"
        color="secondary"
        startIcon={<Icon>image</Icon>}
        onClick={onVerImagen}
        text="Ver imagen"
        disabled={!tieneFoto}
      />
      {/* Botón para seleccionar imagen */}
      <Button
        id="cambiarImagen"
        variant="contained"
        color="secondary"
        startIcon={<Icon>add_photo_alternate</Icon>}
        onClick={() => inputRef.current?.click()}
        text={textoBoton || (tieneFoto ? "Cambiar imagen" : "Añadir imagen")}
        disabled={disabled}
      />

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Modal de confirmación con preview */}
      <Dialog open={modalOpen} onClose={handleCerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" align="center">
            Confirmar imagen
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {/* Preview de la imagen */}
            {previewUrl && (
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            )}

            {/* Checkbox para portada */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={esPortadaTemp}
                  onChange={e => setEsPortadaTemp(e.target.checked)}
                />
              }
              label="Establecer como imagen de portada"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCerrarModal} text="Cancelar" variant="outlined" />
          <Button onClick={handleConfirmar} text="Confirmar" variant="contained" color="primary" />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default InputImagenConPortada;
