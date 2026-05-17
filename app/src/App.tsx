import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ListaCompraProvider } from './context/ListaCompraProvider';
import { Layout } from './components/Layout';
import { ListaPage } from './pages/ListaPage';
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
            <Route path="platos/:id" element={<PlatoEditPage />} />
            <Route path="semana" element={<SemanaPage />} />
            <Route path="lista" element={<ListaPage />} />
          </Route>
        </Routes>
      </ListaCompraProvider>
    </BrowserRouter>
  );
}

export default App;
