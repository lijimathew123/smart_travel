import React, { useEffect, useState } from 'react';
import { travelService } from '../services/api';
import { Star, MapPin, Zap, TrendingUp } from 'lucide-react';

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  backdropFilter: 'blur(12px)',
};

function MatchBadge({ score }) {
  const pct = Math.round(score * 10);
  const color = pct >= 80 ? '#a3e635' : pct >= 60 ? '#fbbf24' : '#60a5fa';
  const bg = pct >= 80 ? 'rgba(163,230,53,0.12)' : pct >= 60 ? 'rgba(251,191,36,0.12)' : 'rgba(99,102,241,0.15)';
  const border = pct >= 80 ? 'rgba(163,230,53,0.3)' : pct >= 60 ? 'rgba(251,191,36,0.3)' : 'rgba(99,102,241,0.35)';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 12px', borderRadius: '20px',
      background: bg, border: `1px solid ${border}`, color,
      fontSize: '0.75rem', fontWeight: 700,
    }}>
      <Star size={11} fill="currentColor" />
      {pct}% Match
    </div>
  );
}

export default function Personalized() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    travelService.getPersonalized()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050814' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.9rem' }}>Curating your perfect spots...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050814', padding: '2rem' }}>
        <div style={{ ...glassCard, padding: '3rem', textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <h3 style={{ color: '#e2e8f0', fontWeight: 700, margin: '0 0 0.75rem', fontSize: '1.2rem' }}>No personalization data yet</h3>
          <p style={{ color: 'rgba(148,163,184,0.65)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
            Search for a few trips first and we'll start curating smart recommendations just for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050814', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs - purple tones */}
      <div style={{ position: 'absolute', top: '-100px', left: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '300px', right: '-60px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(219,39,119,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '100px', left: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>

        {/* Gradient Hero Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(109,40,217,0.6) 0%, rgba(219,39,119,0.4) 50%, rgba(99,102,241,0.5) 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '30px 30px', borderRadius: '20px',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '20px', padding: '5px 14px',
              fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600,
              marginBottom: '1.25rem', letterSpacing: '0.08em',
            }}>
              <Zap size={12} /> AI PERSONALIZATION
            </div>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800,
              color: 'white', margin: '0 0 0.75rem', lineHeight: 1.2,
            }}>
              Recommended for You
            </h1>
            {data.based_on?.top_interests?.length > 0 && (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', margin: '0 0 1.25rem' }}>
                Based on your love for{' '}
                {data.based_on.top_interests.map((interest, i) => (
                  <span key={i} style={{ fontWeight: 700, color: 'white' }}>
                    {i > 0 ? ', ' : ''}{interest}
                  </span>
                ))}
              </p>
            )}
            {/* Based-on pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.based_on?.top_destination && (
                <span style={{
                  padding: '5px 14px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.78rem', color: 'white', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <MapPin size={11} /> Fav: {data.based_on.top_destination}
                </span>
              )}
              {data.based_on?.preferred_travel_type && (
                <span style={{
                  padding: '5px 14px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.78rem', color: 'white', fontWeight: 600,
                }}>
                  {data.based_on.preferred_travel_type} traveller
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Places Found', value: data.places?.length || 0, icon: <MapPin size={16} color="#a5b4fc" /> },
            { label: 'Top Interest', value: data.based_on?.top_interests?.[0] || 'N/A', icon: <Star size={16} color="#fbbf24" /> },
            { label: 'Travel Style', value: data.based_on?.preferred_travel_type || 'N/A', icon: <TrendingUp size={16} color="#34d399" /> },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '1rem 1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                {stat.icon}
                <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'capitalize' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Places grid */}
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(165,180,252,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1rem' }}>Top Matched Places</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
          {data.places?.map((place, idx) => (
            <div key={idx} style={{
              ...glassCard,
              display: 'flex',
              overflow: 'hidden',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Rank sidebar */}
              <div style={{
                width: '52px', flexShrink: 0,
                background: idx === 0
                  ? 'linear-gradient(180deg, rgba(139,92,246,0.4), rgba(99,102,241,0.3))'
                  : 'rgba(255,255,255,0.03)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                padding: '1rem 0',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: idx === 0 ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : 'rgba(99,102,241,0.2)',
                  border: `1px solid ${idx === 0 ? 'rgba(139,92,246,0.7)' : 'rgba(99,102,241,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, color: idx === 0 ? 'white' : '#a5b4fc',
                }}>
                  {idx + 1}
                </div>
                {idx === 0 && <div style={{ fontSize: '0.55rem', color: '#c4b5fd', fontWeight: 600, letterSpacing: '0.05em' }}>TOP</div>}
              </div>

              {/* Content */}
              <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{place.name}</h3>
                  <MatchBadge score={place.personalized_score} />
                </div>
                {place.address && (
                  <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)', margin: '0 0 10px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <MapPin size={12} style={{ marginTop: '2px', flexShrink: 0, color: '#8b5cf6' }} />{place.address}
                  </p>
                )}
                {place.category?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {place.category.slice(0, 3).map(cat => (
                      <span key={cat} style={{
                        fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                        background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#c4b5fd',
                      }}>{cat}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
