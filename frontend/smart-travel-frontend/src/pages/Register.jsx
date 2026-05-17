import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Account', icon: <User size={14} /> },
  { id: 2, label: 'Security', icon: <Lock size={14} /> },
  { id: 3, label: 'Done', icon: <CheckCircle size={14} /> },
];

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  if (!password) return null;
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '10px',
            background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: '0.72rem', color: colors[strength], fontWeight: 600 }}>{labels[strength]}</span>
    </div>
  );
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const fieldStyle = (name) => ({
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${focusedField === name ? 'rgba(14,165,233,0.6)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#e2e8f0',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focusedField === name ? '0 0 0 3px rgba(14,165,233,0.1)' : 'none',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem', fontWeight: 700,
    color: 'rgba(125,211,252,0.7)',
    marginBottom: '6px',
    letterSpacing: '0.1em', textTransform: 'uppercase',
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.username || !formData.email) { setError('Please fill all fields.'); return; }
      setError(''); setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      await authService.register(formData);
      setStep(3);
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#050814',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
          }}>🧭</div>
          <h1 style={{
            fontSize: '1.5rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #e2e8f0, #7dd3fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 0.25rem',
          }}>Create Account</h1>
          <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.875rem', margin: 0 }}>Join SmartTravel and explore smarter</p>
        </div>

        {/* Glass Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>

          {/* Step Progress Bar */}
          {step < 3 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: step >= s.id
                          ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                          : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${step >= s.id ? 'rgba(14,165,233,0.6)' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: step >= s.id ? 'white' : 'rgba(148,163,184,0.4)',
                        transition: 'all 0.3s',
                        boxShadow: step === s.id ? '0 0 16px rgba(14,165,233,0.4)' : 'none',
                      }}>{s.icon}</div>
                      <span style={{ fontSize: '0.65rem', color: step >= s.id ? '#7dd3fc' : 'rgba(148,163,184,0.4)', fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: '1px', margin: '0 6px 18px', background: step > s.id ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.07)', transition: 'background 0.3s' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* Progress fill bar */}
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(step - 1) * 50}%`,
                  background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
                  borderRadius: '10px', transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px', padding: '10px 14px',
              color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem',
            }}>⚠️ {error}</div>
          )}

          {/* Step 1 — Account Info */}
          {step === 1 && (
            <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Username *</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.4)' }} />
                  <input
                    type="text" required placeholder="Choose a username"
                    value={formData.username}
                    style={{ ...fieldStyle('username'), paddingLeft: '38px' }}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148,163,184,0.4)' }} />
                  <input
                    type="email" required placeholder="Your email address"
                    value={formData.email}
                    style={{ ...fieldStyle('email'), paddingLeft: '38px' }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" style={{
                width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: 'white', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                marginTop: '0.25rem', boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
                transition: 'opacity 0.2s',
              }}>
                Continue →
              </button>
            </form>
          )}

          {/* Step 2 — Password */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{
                padding: '10px 14px', background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.15)', borderRadius: '10px',
                fontSize: '0.83rem', color: 'rgba(125,211,252,0.8)',
              }}>
                Setting up password for <strong style={{ color: '#7dd3fc' }}>{formData.username}</strong>
              </div>
              <div>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '13px', top: '13px', color: 'rgba(148,163,184,0.4)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'} required placeholder="Create a strong password"
                    value={formData.password}
                    style={{ ...fieldStyle('password'), paddingLeft: '38px', paddingRight: '44px' }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.5)', padding: '2px',
                  }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '0.25rem' }}>
                <button type="button" onClick={() => { setStep(1); setError(''); }} style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                }}>← Back</button>
                <button type="submit" disabled={loading} style={{
                  flex: 2, padding: '12px', borderRadius: '12px', border: 'none',
                  background: loading ? 'rgba(14,165,233,0.4)' : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  color: 'white', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
                }}>
                  {loading ? (
                    <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Creating...</>
                  ) : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(34,197,94,0.2)',
              }}>
                <CheckCircle size={32} color="#4ade80" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e2e8f0', margin: '0 0 0.75rem' }}>Account Created!</h3>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.9rem', margin: '0 0 1.75rem', lineHeight: 1.6 }}>
                Welcome to SmartTravel, <strong style={{ color: '#a5b4fc' }}>{formData.username}</strong>!<br />
                Your account is ready. Sign in to start planning.
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  color: 'white', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(14,165,233,0.35)',
                }}>
                Go to Login →
              </button>
            </div>
          )}

          {step < 3 && (
            <div style={{ marginTop: '1.5rem', padding: '1rem 0 0', borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.85rem', margin: 0 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#7dd3fc', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(125,211,252,0.3)' }}>Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: rgba(148,163,184,0.35); }`}</style>
    </div>
  );
}
