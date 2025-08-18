import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import { useAuth } from './hooks/useAuth';
import Main from './pages/Main';
import Vault from './pages/Vault';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import DocumentEditor from './pages/DocumentEditor';
import Offer from './pages/Offer';
import Login from './pages/Login';
import Register from './pages/Register';

// Компонент для защищенных маршрутов
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Компонент для авторизованных пользователей
const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="flex bg-paper text-ink min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-paper to-paper/90 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/library" element={<Library />} />
            <Route path="/prices" element={<Settings />} />
            <Route path="/account" element={<Billing />} />
            <Route path="/document/:documentId" element={<DocumentEditor />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;
