import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/productos', label: 'Productos' },
  { to: '/platos', label: 'Platos' },
  { to: '/semana', label: 'Semana' },
  { to: '/lista', label: 'Lista' },
] as const;

export function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <NavLink to="/platos" className="layout__brand">
          Comi2
        </NavLink>
        <nav className="layout__nav">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `layout__link${isActive ? ' layout__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
