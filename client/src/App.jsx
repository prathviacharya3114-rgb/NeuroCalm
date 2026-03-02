import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { InterventionPage } from './pages/InterventionPage';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AssessmentPage } from './components/AssessmentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/intervention" element={<InterventionPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
