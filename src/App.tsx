import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import Main from './pages/Main';
import Vault from './pages/Vault';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import DocumentEditor from './pages/DocumentEditor';
import Offer from './pages/Offer';

function App() {
  return (
    <Router>
      <ToastProvider>
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
              </Routes>
            </div>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
