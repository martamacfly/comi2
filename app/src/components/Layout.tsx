import { useEffect, useState, type ComponentType } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Basket,
  CalendarDots,
  Carrot,
  ClipboardText,
  CookingPot,
  GearSix,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { Modulo } from '../db/types';
import { publicUrl } from '../lib/base';
import { useModulos } from '../lib/opciones';
/** Origen: `assets/imagenes/logo2.svg` (wordmark y favicon), `comi2.svg` (icono cabecera). */
const BRAND_MARK_SRC = publicUrl('logo-mark.svg');
const BRAND_ICON_SRC = publicUrl('brand-icon.svg');

type NavIcon = ComponentType<IconProps>;

const navItems: {
  to: string;
  label: string;
  Icon: NavIcon;
  /** Si se indica, solo aparece con esa sección activada en Opciones */
  modulo?: Modulo;
}[] = [
  { to: '/platos', label: 'Platos', Icon: CookingPot },
  { to: '/productos', label: 'Productos', Icon: Carrot },
  { to: '/despensa', label: 'Despensa', Icon: Basket, modulo: 'despensa' },
  { to: '/semana', label: 'Semana', Icon: CalendarDots },
  { to: '/lista', label: 'Lista', Icon: ClipboardText, modulo: 'listaCompra' },
];

function NavItem({
  to,
  label,
  Icon,
  className,
}: {
  to: string;
  label: string;
  Icon: NavIcon;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `layout__link${isActive ? ' layout__link--active' : ''}${className ? ` ${className}` : ''}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            weight={isActive ? 'duotone' : 'regular'}
            aria-hidden
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function useTecladoVisible(): boolean {
  const [teclado, setTeclado] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const check = () => {
      // Si el viewport visual es más de 150 px más pequeño que el innerHeight, hay teclado
      setTeclado(window.innerHeight - vv.height > 150);
    };

    vv.addEventListener('resize', check);
    return () => vv.removeEventListener('resize', check);
  }, []);

  return teclado;
}

export function Layout() {
  const tecladoVisible = useTecladoVisible();
  const modulos = useModulos();
  const visibles = navItems.filter(
    (item) => item.modulo == null || modulos?.[item.modulo],
  );

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__brand-center">
          <NavLink to="/platos" className="layout__brand" aria-label="Comi2">
            <img
              src={BRAND_MARK_SRC}
              alt=""
              className="layout__brand-wordmark"
            />
            <span className="layout__brand-icon-wrap" aria-hidden>
              <img src={BRAND_ICON_SRC} alt="" className="layout__brand-icon" />
            </span>
          </NavLink>
        </div>
        <nav className="layout__nav layout__nav--desktop" aria-label="Principal">
          {visibles.map(({ to, label, Icon }) => (
            <NavItem key={to} to={to} label={label} Icon={Icon} />
          ))}
        </nav>
        <NavLink
          to="/opciones"
          className={({ isActive }) =>
            `layout__opciones${isActive ? ' layout__opciones--active' : ''}`
          }
          aria-label="Opciones"
          title="Opciones"
        >
          <GearSix size={22} weight="duotone" aria-hidden />
        </NavLink>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <nav
        className={`layout__nav layout__nav--mobile${tecladoVisible ? ' layout__nav--oculto' : ''}`}
        aria-label="Principal móvil"
      >
        {visibles.map(({ to, label, Icon }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            Icon={Icon}
            className="layout__link--mobile"
          />
        ))}
      </nav>
    </div>
  );
}
