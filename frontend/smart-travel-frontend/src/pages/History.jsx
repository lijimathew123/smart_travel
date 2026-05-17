import React, { useEffect, useState } from 'react';
import { travelService } from '../services/api';
import { MapPin, Calendar, Wallet, Users, Clock } from 'lucide-react';

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  backdropFilter: 'blur(12px)',
};

const budgetColors = {
  low: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', text: '#6ee7b7' },
  medium: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', text: '#fcd34d' },
  high: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#f87171' },
};

const typeEmoji = { solo: '🧳', couple: '💑', family: '👨‍👩‍👧', friends: '👥' };

function MiniMapCard({ history }) {
  // Group destinations and count visits
  const destCount = history.reduce((acc, item) => {
    acc[item.destination] = (acc[item.destination] || 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(destCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = sorted[0]?.[1] || 1;

  return (
    <div style={{ ...glassCard, padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Map placeholder with destination pins */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,27,75,0.6) 100%)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '12px',
        height: '180px',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Grid lines for map feel */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '30%', left: '35%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />

        {/* Floating pins for destinations */}
        {sorted.slice(0, 4).map(([dest], i) => {
          const positions = [
            { top: '20%', left: '25%' }, { top: '50%', left: '55%' },
            { top: '30%', left: '70%' }, { top: '65%', left: '35%' },
          ];
          const pos = positions[i] || { top: '50%', left: '50%' };
          return (
            <div key={dest} style={{ position: 'absolute', ...pos, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{
                background: i === 0 ? 'linear-gradient(135deg,#6366f1,#3b82f6)' : 'rgba(99,102,241,0.3)',
                border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.8)' : 'rgba(99,102,241,0.4)'}`,
                borderRadius: '50%', width: i === 0 ? '28px' : '20px', height: i === 0 ? '28px' : '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i === 0 ? '0 0 16px rgba(99,102,241,0.5)' : 'none',
              }}>
                <MapPin size={i === 0 ? 14 : 10} color="white" />
              </div>
              <span style={{ fontSize: '0.6rem', color: '#a5b4fc', fontWeight: 600, whiteSpace: 'nowrap', background: 'rgba(5,8,20,0.8)', padding: '1px 5px', borderRadius: '4px' }}>{dest}</span>
            </div>
          );
        })}

        <div style={{ position: 'absolute', bottom: '12px', right: '14px', fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', fontWeight: 500 }}>
          {history.length} trip{history.length !== 1 ? 's' : ''} tracked
        </div>
      </div>

      {/* Ranked destination bars */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(165,180,252,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1rem' }}>Top Destinations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map(([dest, count], i) => (
            <div key={dest} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                background: i === 0 ? 'linear-gradient(135deg,#6366f1,#3b82f6)' : 'rgba(99,102,241,0.15)',
                border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: i === 0 ? 'white' : '#a5b4fc',
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{dest}</span>
                  <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>{count} visit{count > 1 ? 's' : ''}</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(count / maxCount) * 100}%`,
                    background: i === 0 ? 'linear-gradient(90deg,#6366f1,#3b82f6)' : 'rgba(99,102,241,0.4)',
                    borderRadius: '10px', transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    travelService.getHistory()
      .then(res => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050814' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.9rem' }}>Loading your journey history...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050814', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '0', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '20px', padding: '5px 14px',
            fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 600,
            marginBottom: '1rem', letterSpacing: '0.08em',
          }}>
            <Clock size={12} /> JOURNEY HISTORY
          </div>
          <h1 style={{
            fontSize: '2rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #e2e8f0, #a5b4fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 0.5rem',
          }}>Your Past Trips</h1>
          <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.9rem', margin: 0 }}>
            {history.length} trip{history.length !== 1 ? 's' : ''} recorded — every journey, remembered.
          </p>
        </div>

        {history.length === 0 ? (
          <div style={{ ...glassCard, padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <h3 style={{ color: '#e2e8f0', fontWeight: 700, margin: '0 0 0.5rem' }}>No trips yet</h3>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.9rem', margin: 0 }}>Start searching for destinations to build your history.</p>
          </div>
        ) : (
          <>
            <MiniMapCard history={history} />

            {/* Trip cards list */}
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(165,180,252,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1rem' }}>All Searches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((item) => {
                const bc = budgetColors[item.budget] || budgetColors.medium;
                return (
                  <div key={item.id} style={{
                    ...glassCard, padding: '1.25rem 1.5rem',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(59,130,246,0.25))',
                          border: '1px solid rgba(99,102,241,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1rem',
                        }}>
                          {typeEmoji[item.travel_type] || '🧳'}
                        </div>
                        <div>
                          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={13} color="#6366f1" />{item.destination}
                          </h2>
                          <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={11} /> {item.start_date} → {item.end_date}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                          background: bc.bg, border: `1px solid ${bc.border}`, color: bc.text,
                          textTransform: 'capitalize',
                        }}>
                          <Wallet size={11} style={{ marginRight: '4px', display: 'inline' }} />{item.budget}
                        </span>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: '20px',
                          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc',
                          textTransform: 'capitalize',
                        }}>
                          <Users size={11} style={{ marginRight: '4px', display: 'inline' }} />{item.travel_type}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.45)' }}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {item.summary && (
                      <div style={{
                        padding: '10px 14px',
                        background: 'rgba(99,102,241,0.06)',
                        borderLeft: '3px solid rgba(99,102,241,0.4)',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.83rem',
                        color: 'rgba(203,213,225,0.75)',
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                      }}>
                        "{item.summary}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
