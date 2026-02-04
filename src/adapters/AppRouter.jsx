import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from '../views/HomeView';
import AboutView from '../views/AboutView';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/about" element={<AboutView />} />
      </Routes>
    </Router>
  );
}
