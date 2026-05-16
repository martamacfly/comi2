import type { ComponentType } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  CalendarDots,
  Carrot,
  ClipboardText,
  CookingPot,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
/** Origen: `assets/imagenes/logo2.svg` (wordmark y favicon), `comi2.svg` (icono cabecera). */
const BRAND_MARK_SRC = '/logo-mark.svg';
const BRAND_ICON_SRC = '/brand-icon.svg';

type NavIcon = ComponentType<IconProps>;

const navItems: {
  to: string;
  label: string;
  Icon: NavIcon;
}[] = [
  { to: '/platos', label: 'Platos', Icon: CookingPot },
  { to: '/productos', label: 'Productos', Icon: Carrot },
  { to: '/semana', label: 'Semana', Icon: CalendarDots },
  { to: '/lista', label: 'Lista', Icon: ClipboardText },
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

export function Layout() {
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
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <nav
        className="layout__nav layout__nav--mobile"
        aria-label="Principal móvil"
      >
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} className="layout__link--mobile" />
        ))}
      </nav>
    </div>
  );
}
