import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';

function HomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Track your job search<br /><span className="highlight">with clarity</span></h1>
        <p>
          Register, log in, and manage applications across saved, applied, interview,
          rejected, and offer stages — powered by a live REST API.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Get started free</Link>
          <Link to="/login" className="btn btn-ghost btn-lg">Log in</Link>
        </div>
      </div>
      <div className="hero-cards">
        <div className="hero-card"><span className="badge badge-saved">saved</span><p>Saved roles</p></div>
        <div className="hero-card"><span className="badge badge-applied">applied</span><p>Applications sent</p></div>
        <div className="hero-card"><span className="badge badge-interview">interview</span><p>Interviews</p></div>
        <div className="hero-card"><span className="badge badge-offer">offer</span><p>Offers received</p></div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
