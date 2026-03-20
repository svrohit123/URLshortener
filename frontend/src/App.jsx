import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyber-bg text-cyber-text">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* Footer */}
        <footer className="relative z-10 border-t border-cyber-border/20 py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-cyber-text-muted">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyber-primary to-blue-400 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span>SecureLink — Security-First URL Shortener</span>
            </div>
            <p className="text-xs text-cyber-text-muted/60">
              Built with Spring Boot & React
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
