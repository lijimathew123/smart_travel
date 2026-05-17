import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import Personalized from './pages/Personalized';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResultsPage from './pages/SearchResultsPage';
import { useAuth } from './context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(5, 8, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
      padding: '0 2.5rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
        }}>🧭</div>
        <span style={{
          fontSize: '1.1rem', fontWeight: 700,
          background: 'linear-gradient(90deg, #a5b4fc, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '0.02em',
        }}>SmartTravel</span>
      </Link>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <NavLink to="/" label="Search" active={isActive('/')} />
        {isAuthenticated ? (
          <>
            <NavLink to="/personalized" label="For You" active={isActive('/personalized')} />
            <NavLink to="/history" label="History" active={isActive('/history')} />
            <div style={{
              marginLeft: '8px',
              padding: '6px 14px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              color: '#a5b4fc',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              Hi, {user?.username}
            </div>
            <button
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" label="Login" active={isActive('/login')} />
            <Link to="/register" style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              color: 'white',
              padding: '7px 18px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'opacity 0.2s',
            }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} style={{
      textDecoration: 'none',
      color: active ? '#a5b4fc' : 'rgba(148, 163, 184, 0.8)',
      fontSize: '0.875rem',
      fontWeight: active ? 600 : 400,
      padding: '6px 14px',
      borderRadius: '8px',
      background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      border: active ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
      transition: 'all 0.2s',
    }}>
      {label}
    </Link>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#050814', color: '#e2e8f0' }}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={isAuthenticated ? <History /> : <Login />} />
            <Route path="/personalized" element={isAuthenticated ? <Personalized /> : <Login />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
