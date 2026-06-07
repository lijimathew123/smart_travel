import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Thermometer, Clock, Star } from 'lucide-react';
import EmergencyContactCard from '../components/EmergencyContactCard';


const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  backdropFilter: 'blur(12px)',
};

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const statePayload = location.state || null;

  const [payload, setPayload] = useState(() => {
    if (statePayload) return statePayload;
    const raw = sessionStorage.getItem('last_search_payload');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (statePayload) setPayload(statePayload);
  }, [statePayload]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!payload) {
      navigate('/', { replace: true });
      return;
    }

    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch('/api/recommend-trip/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error(`Server ${resp.status}`);
        const data = await resp.json();
        setResult(data);
        sessionStorage.setItem('last_search_payload', JSON.stringify(payload));
        sessionStorage.setItem('last_search_result', JSON.stringify(data));
      } catch (err) {
        setError(err?.message || 'Request failed');
      } finally {
        setLoading(false);
      }
    }

    const cached = sessionStorage.getItem('last_search_result');
    if (cached) {
      try {
        setResult(JSON.parse(cached));
      } catch {
        sessionStorage.removeItem('last_search_result');
        fetchResults();
      }
    } else {
      fetchResults();
    }
  }, [payload, navigate]);

  if (loading) return <div>Loading results…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!result) return <div>No results</div>;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050814',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orbs (same as Home.jsx) */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-100px',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '200px',
          right: '-80px',
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '40%',
          width: '350px',
          height: '350px',
          background:
            'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '3rem 1.5rem 4rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero heading (kept minimal) */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 1rem',
              background:
                'linear-gradient(135deg, #e2e8f0 0%, #a5b4fc 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Results for {payload?.destination}
          </h1>
          <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '1rem', margin: 0 }}>
            Get your weather, itinerary, and top must-visit places.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Weather Card (same markup as Home.jsx) */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.1) 100%)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: '16px',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MapPin size={16} color="#60a5fa" />
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#60a5fa',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Weather in {result.destination}
                </span>
              </div>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: '#e2e8f0',
                  margin: '0',
                  textTransform: 'capitalize',
                  fontWeight: 500,
                }}
              >
                {result.weather?.conditions}
              </p>
              {result.weather?.feels_like && (
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(148,163,184,0.7)',
                    margin: '4px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Thermometer size={13} /> Feels like {result.weather.feels_like}°C
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #93c5fd, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                {result.weather?.temperature}°C
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div style={{ ...glassCard, padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <Clock size={18} color="#a5b4fc" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
                AI Suggested Itinerary
              </h2>
            </div>

            {result.itinerary?.summary && (
              <p
                style={{
                  color: 'rgba(148,163,184,0.8)',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                  margin: '0.75rem 0 1.5rem',
                  padding: '12px 16px',
                  background: 'rgba(99,102,241,0.08)',
                  borderLeft: '3px solid rgba(99,102,241,0.5)',
                  borderRadius: '0 8px 8px 0',
                }}
              >
                {result.itinerary.summary}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.itinerary?.days?.map((day, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: '3px solid rgba(99,102,241,0.5)',
                    borderRadius: '0 12px 12px 0',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeftWidth: '3px',
                    borderLeftColor: index % 2 === 0 ? 'rgba(99,102,241,0.6)' : 'rgba(59,130,246,0.6)',
                  }}
                >
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem' }}>
                    {day.day}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {day.morning && (
                      <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.88rem', margin: 0 }}>
                        <span style={{ color: '#fbbf24', fontWeight: 600 }}>Morning:</span> {day.morning}
                      </p>
                    )}
                    {day.afternoon && (
                      <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.88rem', margin: 0 }}>
                        <span style={{ color: '#fb923c', fontWeight: 600 }}>Afternoon:</span> {day.afternoon}
                      </p>
                    )}
                    {day.evening && (
                      <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.88rem', margin: 0 }}>
                        <span style={{ color: '#818cf8', fontWeight: 600 }}>Evening:</span> {day.evening}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fecaca',
                  fontWeight: 900,
                }}
              >
                !
              </span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fee2e2', margin: 0 }}>
                Emergency Contacts Near You
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24', margin: '0 0 0.75rem' }}>
                  Airports (up to 2)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {result.emergency_places?.airports?.map((place, index) => (
                    <div key={index}>
                      {/* Lazy import avoided; keep JSX simple */}
                      {/* eslint-disable-next-line import/no-named-as-default */}
                      {/* EmergencyContactCard is imported below */}
                      <EmergencyContactCard place={place} index={index} />
                    </div>
                  ))}
                  {(!result.emergency_places?.airports || result.emergency_places.airports.length === 0) && (
                    <div style={{ color: 'rgba(148,163,184,0.75)' }}>No nearby airports found.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444', margin: '0 0 0.75rem' }}>
                  Hospitals (up to 2)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {result.emergency_places?.hospitals?.map((place, index) => (
                    <div key={index}>
                      <EmergencyContactCard place={place} index={index} />
                    </div>
                  ))}
                  {(!result.emergency_places?.hospitals || result.emergency_places.hospitals.length === 0) && (
                    <div style={{ color: 'rgba(148,163,184,0.75)' }}>No nearby hospitals found.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f97316', margin: '0 0 0.75rem' }}>
                  Police Stations (up to 2)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {result.emergency_places?.police_stations?.map((place, index) => (
                    <div key={index}>
                      <EmergencyContactCard place={place} index={index} />
                    </div>
                  ))}
                  {(!result.emergency_places?.police_stations || result.emergency_places.police_stations.length === 0) && (
                    <div style={{ color: 'rgba(148,163,184,0.75)' }}>No nearby police stations found.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fb7185', margin: '0 0 0.75rem' }}>
                  Fire Stations (up to 2)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {result.emergency_places?.fire_stations?.map((place, index) => (
                    <div key={index}>
                      <EmergencyContactCard place={place} index={index} />
                    </div>
                  ))}
                  {(!result.emergency_places?.fire_stations || result.emergency_places.fire_stations.length === 0) && (
                    <div style={{ color: 'rgba(148,163,184,0.75)' }}>No nearby fire stations found.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60a5fa', margin: '0 0 0.75rem' }}>
                  Ambulance Services (up to 2)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {result.emergency_places?.ambulance_services?.map((place, index) => (
                    <div key={index}>
                      <EmergencyContactCard place={place} index={index} />
                    </div>
                  ))}
                  {(!result.emergency_places?.ambulance_services || result.emergency_places.ambulance_services.length === 0) && (
                    <div style={{ color: 'rgba(148,163,184,0.75)' }}>No nearby ambulance services found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* Places (Must Visit Places) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <Star size={18} color="#a5b4fc" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
                Must Visit Places
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {result.places?.map((place, index) => (
                <div
                  key={index}
                  style={{
                    ...glassCard,
                    padding: '1.25rem',
                    transition: 'border-color 0.2s, transform 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', margin: 0, flex: 1 }}>{place.name}</h4>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: 'rgba(99,102,241,0.2)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#a5b4fc',
                        flexShrink: 0,
                        marginLeft: '8px',
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {place.address && (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(148,163,184,0.65)',
                        margin: '0 0 10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '4px',
                      }}
                    >
                      <MapPin size={12} style={{ marginTop: '2px', flexShrink: 0 }} />
                      {place.address}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {place.category?.slice(0, 1).map((cat) => (
                      <span
                        key={cat}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: 'rgba(99,102,241,0.12)',
                          border: '1px solid rgba(99,102,241,0.2)',
                          color: '#a5b4fc',
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

