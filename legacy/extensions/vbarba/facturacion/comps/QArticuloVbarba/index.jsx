import { Field } from "@quimera/comps";
import { useStateValue, util } from "quimera";
import { API } from "quimera/lib";
import React, { useCallback, useState, useEffect, useRef } from "react";

function QArticuloVbarba({ seVende = false, codFamilia = null, noOptionsText = "Buscar artículo por nombre", ...props }) {
  const [options, setOptions] = useState([]);
  const [_, dispatch] = useStateValue();
  const containerRef = useRef(null);

  const getFiltroOptions = (seVende, codFamilia) => {
    const options = [];
    if (seVende) {
      options.push(["sevende", "eq", true]);
    }
    if (codFamilia) {
      options.push(["codfamilia", "eq", codFamilia]);
    }

    return options.length > 0 ? options : null;
  };

  const onKeyDown = event => {
    if (event.key === "Tab" || event.key === 9) {
      if (options.length === 1) {
        dispatch({
          type: "onLineaBufferChanged",
          payload: {
            field: "referencia",
            value: options[0].key,
            option: options[0].option,
          },
        });
      }
    }
  };

  // Función para manejar clicks y detectar selección
  const handleClick = () => {
    // Detectar clics y verificar si hay selección después de un delay
    setTimeout(() => {
      const inputElement = containerRef.current?.querySelector('input[type="text"]');
      if (inputElement && inputElement.value && inputElement.value.includes('€')) {
        console.log('Click detectado, seleccionando texto:', inputElement.value);
        inputElement.select();
      }
    }, 100);
  };

  // Usar MutationObserver para detectar cambios en el input sin interferir
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const inputElement = containerRef.current?.querySelector('input[type="text"]');
      if (inputElement) {
        const currentValue = inputElement.value;

        // Si el valor contiene € (indica selección de opción) y no está ya seleccionado
        if (currentValue && currentValue.includes('€') && inputElement.selectionStart === inputElement.selectionEnd) {
          console.log('Detectado cambio con selección:', currentValue);
          setTimeout(() => {
            inputElement.select();
          }, 50);
        }
      }
    });

    // Observar cambios en el contenedor específico
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value']
      });
    }

    return () => observer.disconnect();
  }, []);

  const getOptions = useCallback(
    (text, key) => {
      const filtroBase = key
        ? ["referencia", "eq", key]
        : {
          or: [
            ["descripcion", "like", text],
            ["referencia", "like", text],
            ["codbarras", "like", text],
          ],
        };
      const filtroOptions = getFiltroOptions(seVende, codFamilia);
      filtroOptions && filtroOptions.push(filtroBase);
      const filtro = filtroOptions
        ? {
          and: filtroOptions,
        }
        : filtroBase;
      if (text !== null || key !== null) {
        API("articulos")
          .get()
          .select("referencia,codbarras,descripcion,precioRef")
          .filter(filtro)
          .page({ limit: 100 })
          .success(response =>
            setOptions(
              response.data.map(articulo => {
                const pvp = util.euros(articulo.precioRef);

                return {
                  key: articulo.referencia,
                  value: `${pvp} ${articulo.descripcion} (${articulo.referencia}) / (${articulo.codbarras})`,
                  option: articulo,
                };
              }),
            ),
          )
          .error(error => console.log("Error", error))
          .go();
      }
    },
    [seVende],
  );

  return (
    <div
      ref={containerRef}
      style={{ width: '100%' }}
      onClick={handleClick}
    >
      <Field.Select
        getOptions={getOptions}
        options={options}
        noOptionsText={noOptionsText}
        onKeyDown={onKeyDown}
        async
        {...props}
      />
    </div>
  );
}

export default QArticuloVbarba;
