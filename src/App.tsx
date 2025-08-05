import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Main from './pages/Main';
import Vault from './pages/Vault';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Billing from './pages/Billing';

function App() {
  return (
    <Router>
      <div className="flex bg-paper text-ink min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gradient-to-br from-paper to-paper/90 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/library" element={<Library />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing" element={<Billing />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
