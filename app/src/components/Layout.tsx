import type { ComponentType } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  CalendarDots,
  Carrot,
  ClipboardText,
  CookingPot,
  ForkKnife,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';

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
      <Icon size={20} weight="regular" aria-hidden />
      <span>{label}</span>
    </NavLink>
  );
}

export function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <NavLink to="/platos" className="layout__brand">
          <ForkKnife size={26} weight="duotone" aria-hidden />
          <span>Comi2</span>
        </NavLink>
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
