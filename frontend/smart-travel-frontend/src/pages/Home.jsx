import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { travelService } from '../services/api';
import { Sparkles, MapPin, Wind, Thermometer, Clock, Star, ChevronRight } from 'lucide-react';


const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  backdropFilter: 'blur(12px)',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: '#e2e8f0',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'rgba(165, 180, 252, 0.7)',
  marginBottom: '6px',
  textTransform: 'uppercase',
};

export default function Home() {
  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
    travel_type: '',
    interests: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanInterests = formData.interests.split(',').map(i => i.trim()).filter(i => i !== '');
    if (cleanInterests.length === 0) {
      alert('Please enter at least one interest (e.g., Shopping, Beach).');
      return;
    }

    const payload = { ...formData, interests: cleanInterests };
    sessionStorage.setItem('last_search_payload', JSON.stringify(payload));

    setLoading(true);
    try {
      const response = await travelService.recommendTrip(payload);
      sessionStorage.setItem('last_search_result', JSON.stringify(response.data));
      navigate('/search-results', { state: payload });
      setResult(response.data);
    } catch {
      alert('Error fetching recommendation. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };


  const getFieldStyle = (name) => ({
    ...inputStyle,
    borderColor: focusedField === name ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)',
    boxShadow: focusedField === name ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#050814', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '-120px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '200px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-50px', left: '40%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 4rem', position: 'relative', zIndex: 1 }}>
        {/* Hero heading */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '20px', padding: '6px 16px',
            fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 600,
            marginBottom: '1.5rem', letterSpacing: '0.05em',
          }}>
            <Sparkles size={13} /> AI-POWERED TRAVEL PLANNER
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 1rem',
            background: 'linear-gradient(135deg, #e2e8f0 0%, #a5b4fc 50%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Plan Your Perfect Journey
          </h1>
          <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '1rem', margin: 0 }}>
            Get AI-curated itineraries, real-time weather, and top places — in seconds.
          </p>
        </div>

        {/* Search Form */}
        <div style={{ ...glassCard, padding: '2rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Destination *</label>
                <input
                  type="text" placeholder="e.g. Kochi, Goa, Paris"
                  style={getFieldStyle('destination')}
                  value={formData.destination}
                  onFocus={() => setFocusedField('destination')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Start Date *</label>
                <input
                  type="date"
                  style={getFieldStyle('start_date')}
                  value={formData.start_date}
                  onFocus={() => setFocusedField('start_date')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>End Date *</label>
                <input
                  type="date"
                  style={getFieldStyle('end_date')}
                  value={formData.end_date}
                  onFocus={() => setFocusedField('end_date')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Budget *</label>
                <select
                  style={getFieldStyle('budget')}
                  value={formData.budget}
                  onFocus={() => setFocusedField('budget')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  required
                >
                  <option value="" disabled style={{ background: '#1e1b4b' }}>Select Budget</option>
                  <option value="low" style={{ background: '#1e1b4b' }}>Low Budget</option>
                  <option value="medium" style={{ background: '#1e1b4b' }}>Medium Budget</option>
                  <option value="high" style={{ background: '#1e1b4b' }}>High Budget</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Travel Type *</label>
                <select
                  style={getFieldStyle('travel_type')}
                  value={formData.travel_type}
                  onFocus={() => setFocusedField('travel_type')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, travel_type: e.target.value })}
                  required
                >
                  <option value="" disabled style={{ background: '#1e1b4b' }}>Select Type</option>
                  <option value="solo" style={{ background: '#1e1b4b' }}>Solo</option>
                  <option value="couple" style={{ background: '#1e1b4b' }}>Couple</option>
                  <option value="family" style={{ background: '#1e1b4b' }}>Family</option>
                  <option value="friends" style={{ background: '#1e1b4b' }}>Friends</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Interests *</label>
                <input
                  type="text" placeholder="Shopping, Sightseeing, Beach"
                  style={getFieldStyle('interests')}
                  value={formData.interests}
                  onFocus={() => setFocusedField('interests')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, interests: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #3b82f6)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'opacity 0.2s',
                letterSpacing: '0.02em',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Generating your itinerary...
                </>
              ) : (
                <><Sparkles size={18} /> Get Smart Recommendations</>
              )}
            </button>
          </form>
        </div>

        {/* Results (kept only for debugging; should navigate away on submit) */}
        {false && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>


            {/* Weather Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.1) 100%)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: '16px',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MapPin size={16} color="#60a5fa" />
                  <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weather in {result.destination}</span>
                </div>
                <p style={{ fontSize: '1.1rem', color: '#e2e8f0', margin: '0', textTransform: 'capitalize', fontWeight: 500 }}>{result.weather?.conditions}</p>
                {result.weather?.feels_like && (
                  <p style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.7)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Thermometer size={13} /> Feels like {result.weather.feels_like}°C
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '3.5rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, #93c5fd, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}>{result.weather?.temperature}°C</div>
              </div>
            </div>

            {/* Itinerary */}
            <div style={{ ...glassCard, padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                <Clock size={18} color="#a5b4fc" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>AI Suggested Itinerary</h2>
              </div>
              {result.itinerary?.summary && (
                <p style={{
                  color: 'rgba(148,163,184,0.8)', fontStyle: 'italic', fontSize: '0.9rem',
                  margin: '0.75rem 0 1.5rem',
                  padding: '12px 16px',
                  background: 'rgba(99,102,241,0.08)',
                  borderLeft: '3px solid rgba(99,102,241,0.5)',
                  borderRadius: '0 8px 8px 0',
                }}>
                  {result.itinerary.summary}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {result.itinerary?.days?.map((day, index) => (
                  <div key={index} style={{
                    padding: '1.25rem 1.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: '3px solid rgba(99,102,241,0.5)',
                    borderRadius: '0 12px 12px 0',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeftWidth: '3px',
                    borderLeftColor: index % 2 === 0 ? 'rgba(99,102,241,0.6)' : 'rgba(59,130,246,0.6)',
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem' }}>{day.day}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {day.morning && <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.88rem', margin: 0 }}><span style={{ color: '#fbbf24', fontWeight: 600 }}>Morning:</span> {day.morning}</p>}
                      {day.afternoon && <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.88rem', margin: 0 }}><span style={{ color: '#fb923c', fontWeight: 600 }}>Afternoon:</span> {day.afternoon}</p>}
                      {day.evening && <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.88rem', margin: 0 }}><span style={{ color: '#818cf8', fontWeight: 600 }}>Evening:</span> {day.evening}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Places */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <Star size={18} color="#a5b4fc" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Must Visit Places</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {result.places?.map((place, index) => (
                  <div key={index} style={{
                    ...glassCard,
                    padding: '1.25rem',
                    transition: 'border-color 0.2s, transform 0.2s',
                    cursor: 'default',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', margin: 0, flex: 1 }}>{place.name}</h4>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '6px',
                        background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, color: '#a5b4fc', flexShrink: 0, marginLeft: '8px',
                      }}>
                        {index + 1}
                      </div>
                    </div>
                    {place.address && <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.65)', margin: '0 0 10px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}><MapPin size={12} style={{ marginTop: '2px', flexShrink: 0 }} />{place.address}</p>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {place.category?.slice(0, 2).map(cat => (
                        <span key={cat} style={{
                          fontSize: '0.72rem', fontWeight: 600,
                          padding: '3px 10px', borderRadius: '20px',
                          background: 'rgba(99,102,241,0.12)',
                          border: '1px solid rgba(99,102,241,0.2)',
                          color: '#a5b4fc',
                        }}>{cat}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }`}</style>
    </div>
  );
}
