import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ListaCompraProvider } from './context/ListaCompraProvider';
import { Layout } from './components/Layout';
import { ModuloRoute } from './components/ModuloRoute';
import { DespensaPage } from './pages/DespensaPage';
import { ListaPage } from './pages/ListaPage';
import { OpcionesPage } from './pages/OpcionesPage';
import { PlatoDetailPage } from './pages/PlatoDetailPage';
import { PlatoEditPage } from './pages/PlatoEditPage';
import { PlatosPage } from './pages/PlatosPage';
import { ProductoPlatosPage } from './pages/ProductoPlatosPage';
import { ProductosPage } from './pages/ProductosPage';
import { SemanaPage } from './pages/SemanaPage';
import './styles/tokens.css';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <ListaCompraProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/platos" replace />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="productos/:id" element={<ProductoPlatosPage />} />
            <Route path="platos" element={<PlatosPage />} />
            <Route path="platos/nuevo" element={<PlatoEditPage />} />
            <Route path="platos/:id/editar" element={<PlatoEditPage />} />
            <Route path="platos/:id" element={<PlatoDetailPage />} />
            <Route path="semana" element={<SemanaPage />} />
            <Route
              path="despensa"
              element={
                <ModuloRoute modulo="despensa">
                  <DespensaPage />
                </ModuloRoute>
              }
            />
            <Route
              path="lista"
              element={
                <ModuloRoute modulo="listaCompra">
                  <ListaPage />
                </ModuloRoute>
              }
            />
            <Route path="opciones" element={<OpcionesPage />} />
          </Route>
        </Routes>
      </ListaCompraProvider>
    </BrowserRouter>
  );
}

export default App;
