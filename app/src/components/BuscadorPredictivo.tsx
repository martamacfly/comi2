import { useMemo, useState, type ReactNode } from 'react';
import { MagnifyingGlass, Plus, X } from '@phosphor-icons/react';
import { normalizarBusqueda } from '../lib/despensa';

const MAX_SUGERENCIAS = 8;
const CLAVE_CREAR = '__crear__';

export interface OpcionBuscador {
  clave: string;
  nombre: string;
  icono: ReactNode;
  /** Texto pequeño a la derecha, p. ej. «Plato» o «Producto» */
  etiqueta?: string;
}

interface BuscadorPredictivoProps {
  /** Identificador único en la página (para los atributos de accesibilidad) */
  id: string;
  opciones: OpcionBuscador[];
  onElegir: (clave: string) => void | Promise<void>;
  /** Si se indica, ofrece crear algo nuevo con el texto escrito */
  onCrear?: (texto: string) => void | Promise<void>;
  textoCrear?: (texto: string) => string;
  /** Para no ofrecer crear algo que ya existe aunque no esté entre las opciones */
  puedeCrear?: (texto: string) => boolean;
  textoSinResultados: (texto: string) => string;
  placeholder: string;
  ariaLabel: string;
  disabled?: boolean;
}

export function BuscadorPredictivo({
  id,
  opciones,
  onElegir,
  onCrear,
  textoCrear = (t) => `Crear «${t}»`,
  puedeCrear,
  textoSinResultados,
  placeholder,
  ariaLabel,
  disabled,
}: BuscadorPredictivoProps) {
  const [consulta, setConsulta] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);

  const sugerencias = useMemo<OpcionBuscador[]>(() => {
    const q = normalizarBusqueda(consulta);
    if (!q) return [];
    // Primero las que empiezan por la consulta, luego las que la contienen
    const empiezan: OpcionBuscador[] = [];
    const contienen: OpcionBuscador[] = [];
    let exacta = false;
    for (const o of opciones) {
      const n = normalizarBusqueda(o.nombre);
      if (n === q) exacta = true;
      if (n.startsWith(q)) empiezan.push(o);
      else if (n.includes(q)) contienen.push(o);
    }
    const porNombre = (a: OpcionBuscador, b: OpcionBuscador) =>
      a.nombre.localeCompare(b.nombre, 'es');
    const lista = [...empiezan.sort(porNombre), ...contienen.sort(porNombre)].slice(
      0,
      MAX_SUGERENCIAS,
    );
    if (onCrear && !exacta && (puedeCrear?.(consulta) ?? true)) {
      lista.push({
        clave: CLAVE_CREAR,
        nombre: textoCrear(consulta.trim()),
        icono: <Plus size={18} weight="bold" aria-hidden />,
      });
    }
    return lista;
  }, [consulta, opciones, onCrear, textoCrear, puedeCrear]);

  const elegir = async (o: OpcionBuscador) => {
    const texto = consulta.trim();
    // Limpiar antes de guardar para no borrar lo que se teclee mientras tanto
    setConsulta('');
    setActivo(0);
    if (o.clave === CLAVE_CREAR) await onCrear?.(texto);
    else await onElegir(o.clave);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && sugerencias.length > 0) {
      e.preventDefault();
      setAbierto(true);
      setActivo((i) => (i + 1) % sugerencias.length);
    } else if (e.key === 'ArrowUp' && sugerencias.length > 0) {
      e.preventDefault();
      setActivo((i) => (i - 1 + sugerencias.length) % sugerencias.length);
    } else if (e.key === 'Enter') {
      // También evita enviar el formulario en el que esté el buscador
      e.preventDefault();
      const o = sugerencias[activo];
      if (o) void elegir(o);
    } else if (e.key === 'Escape') {
      setAbierto(false);
    }
  };

  const mostrarSugerencias = abierto && consulta.trim() !== '';
  const idOpcion = (o: OpcionBuscador) => `${id}-sug-${o.clave}`;

  return (
    <div className="buscador">
      <div className="platos-search buscador__campo">
        <MagnifyingGlass
          size={18}
          weight="regular"
          className="platos-search__icon"
          aria-hidden
        />
        <input
          type="text"
          className="platos-search__input"
          placeholder={placeholder}
          value={consulta}
          onChange={(e) => {
            setConsulta(e.target.value);
            setActivo(0);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setAbierto(false)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={mostrarSugerencias}
          aria-controls={`${id}-sugerencias`}
          aria-autocomplete="list"
          aria-activedescendant={
            mostrarSugerencias && sugerencias[activo]
              ? idOpcion(sugerencias[activo])
              : undefined
          }
          aria-label={ariaLabel}
          autoComplete="off"
          disabled={disabled}
        />
        {consulta && (
          <button
            type="button"
            className="platos-search__clear"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setConsulta('')}
            aria-label="Borrar búsqueda"
          >
            <X size={16} weight="bold" aria-hidden />
          </button>
        )}
      </div>

      {mostrarSugerencias && (
        <ul id={`${id}-sugerencias`} className="buscador-sugerencias" role="listbox">
          {sugerencias.length === 0 ? (
            <li className="buscador-sugerencias__vacio muted">
              {textoSinResultados(consulta.trim())}
            </li>
          ) : (
            sugerencias.map((o, i) => (
              <li
                key={o.clave}
                id={idOpcion(o)}
                role="option"
                aria-selected={i === activo}
                className={`buscador-sugerencias__item${
                  i === activo ? ' buscador-sugerencias__item--activo' : ''
                }${o.clave === CLAVE_CREAR ? ' buscador-sugerencias__item--crear' : ''}`}
                // mousedown para que el blur del input no cierre antes del click
                onMouseDown={(e) => {
                  e.preventDefault();
                  void elegir(o);
                }}
                onMouseEnter={() => setActivo(i)}
              >
                {o.icono}
                <span className="buscador-sugerencias__nombre">{o.nombre}</span>
                {o.etiqueta && (
                  <span className="buscador-sugerencias__tipo">{o.etiqueta}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
