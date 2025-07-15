import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RiskDashboard from './pages/RiskDashboard';
import MapExplorer from './pages/MapExplorer';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="space-y-6">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/risk" element={<RiskDashboard />} />
          <Route path="/map" element={<MapExplorer />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}