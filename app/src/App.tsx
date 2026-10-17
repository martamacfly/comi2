import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DespensaPage } from './pages/DespensaPage';
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
          <Route path="despensa" element={<DespensaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
