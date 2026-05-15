import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ListaPage } from './pages/ListaPage';
import { PlatoEditPage } from './pages/PlatoEditPage';
import { PlatosPage } from './pages/PlatosPage';
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
          <Route path="platos" element={<PlatosPage />} />
          <Route path="platos/nuevo" element={<PlatoEditPage />} />
          <Route path="platos/:id" element={<PlatoEditPage />} />
          <Route path="semana" element={<SemanaPage />} />
          <Route path="lista" element={<ListaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
