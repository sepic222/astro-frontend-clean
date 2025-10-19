import React, { useState, useRef } from 'react';
import { geocodeCity } from '../utils/geocode';
import { api } from '../utils/api';
import { useSurvey } from "../survey/SurveyContext";

export default function BirthFormNew({ setChartData, setLoading, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    birthCity: '',
    birthCountry: '',
    birthDate: '',
    birthTime: '',
    timeAccuracy: '',
    email: '',
  });
  const { surveyData, updateSurvey, resetSurvey } = useSurvey();
  const [coords, setCoords] = useState({ latitude: '', longitude: '' });
  const [errors, setErrors] = useState({});
  const lastReqId = useRef(0);
  const debounceTimer = useRef(null);
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // keep formData in SurveyContext too (optional)
if (field === 'name' || field === 'email') {
  updateSurvey({ [field]: value });
}
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'birthCity') handleCityChange(value);
  };

  async function handleCityChange(city) {
    setErrors(prev => ({ ...prev, birthCity: '', general: '' }));
  
    // Debounce
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  
    // Need at least 3 chars AND a country before we geocode
    if (city.trim().length < 3 || !formData.birthCountry.trim()) {
      setCoords({ latitude: '', longitude: '' });
      return;
    }
  
    const reqId = ++lastReqId.current;
    debounceTimer.current = setTimeout(async () => {
      try {
        // real backend-powered geocode
        const { latitude, longitude } = await geocodeCity(city, formData.birthCountry);
  
        if (reqId === lastReqId.current) {
          if (
            Number.isFinite(Number(latitude)) &&
            Number.isFinite(Number(longitude))
          ) {
            setCoords({ latitude, longitude });
          } else {
            setCoords({ latitude: '', longitude: '' });
            setErrors(prev => ({
              ...prev,
              birthCity: 'Could not find that location. Please check city & country.'
            }));
          }
        }
      } catch (_err) {
        if (reqId === lastReqId.current) {
          setCoords({ latitude: '', longitude: '' });
          setErrors(prev => ({
            ...prev,
            birthCity: 'Could not find that location. Please check city & country.'
          }));
        }
      }
    }, 300);
  }

const validateForm = () => {
  const newErrors = {};

  if (!formData.birthCity.trim()) newErrors.birthCity = 'City is required';
  if (!formData.birthCountry.trim()) newErrors.birthCountry = 'Country is required';
  if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
  if (!formData.birthTime) newErrors.birthTime = 'Birth time is required';
  if (!coords.latitude || !coords.longitude) newErrors.general = 'Valid location coordinates are required';

  if (!formData.email || !formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    newErrors.email = 'Please enter a valid email';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const apiUrl = api('/api/birth-chart-swisseph');
      // 3) SUBMIT BODY: include email
const body = {
  date: formData.birthDate,
  time: formData.birthTime,
  latitude: coords.latitude,
  longitude: coords.longitude,
  name: formData.name,
  city: formData.birthCity,
  country: formData.birthCountry,
  timeAccuracy: formData.timeAccuracy,
  email: formData.email            // <-- NEW
};

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
// after const data = await response.json();
console.log('savedChartId:', data.savedChartId);
// e.g., setSavedId(data.savedChartId) or show a toast
      if (!res.ok) {
        setErrors({ general: data?.error || 'Failed to fetch birth chart.' });
        setChartData(null);
        return;
      }
      setChartData(data);
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Network error. Please try again.' });
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    console.log('Going to previous screen');
  };

  return (
    <div style={{
      alignItems: 'start',
      backgroundColor: '#ffffff',
      display: 'grid',
      justifyItems: 'center',
      width: '100vw',
      minHeight: '100vh'
    }}>
      <div style={{ backgroundColor: '#ffffff', height: '1600px', overflow: 'hidden', width: '414px' }}>
        <div style={{ backgroundColor: '#121212', borderRadius: '25px', height: '1732px', position: 'relative', padding: '20px' }}>
          <div style={{
            WebkitTextStroke: '1px #000000', color: '#ffffff', fontFamily: '"Gotham Bold", Arial, sans-serif',
            fontSize: '20px', fontWeight: 'bold', position: 'absolute', left: '49px', top: '109px',
            width: '265px', letterSpacing: '-1.20px', lineHeight: '24px'
          }}>
            What name should we call you in the credits?
          </div>
          <div style={{
            color: '#cccccc', fontFamily: '"Gotham Medium", Arial, sans-serif', fontSize: '15px', fontWeight: 500,
            position: 'absolute', left: '49px', top: '173px', width: '284px', letterSpacing: '-0.84px', lineHeight: '24px'
          }}>
            <span style={{ letterSpacing: '-0.12px' }}>
              (Optional but iconic. Real name,<br />
              nickname, alter ego — your call.)
              <br /><br />
            </span>
            <span style={{ fontStyle: 'italic', letterSpacing: '-0.12px' }}>
              e.g., Cinema Barbie, Meryl Streep Jr., Hot Priest Energy, Velvet Scorpio, Sofia Coppola's Intern, etc…
            </span>
          </div>

{/* Email Input (shown under Name) */}
<input
  type="email"
  placeholder="Email (for your reading)"
  value={formData.email}
  onChange={(e) => handleInputChange('email', e.target.value)}
  style={{
    position: 'absolute',
    left: '50px',
    top: '382px',   // keeps it under the Name field
    width: '296px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: errors.email ? '1px solid #ff4b4b' : '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    padding: '0 15px',
    outline: 'none'
  }}
/>
          <div style={{
            WebkitTextStroke: '1px #000000', color: '#ffffff', fontFamily: '"Gotham Bold", Arial, sans-serif',
            fontSize: '20px', fontWeight: 'bold', position: 'absolute', left: '49px', top: '428px',
            letterSpacing: '-1.20px', lineHeight: '24px'
          }}>
            City + Country of Birth
          </div>

          <div style={{
            color: '#cccccc', fontFamily: '"Gotham Medium", Arial, sans-serif', fontSize: '15px', fontWeight: 500,
            position: 'absolute', left: '49px', top: '466px', width: '296px', letterSpacing: '-0.84px', lineHeight: '24px'
          }}>
            We'll use this to calculate your full chart, not just your Sun sign.
          </div>

          <input
            type="text"
            placeholder="City"
            value={formData.birthCity}
            onChange={(e) => handleInputChange('birthCity', e.target.value)}
            style={{
              position: 'absolute', left: '50px', top: '529px', width: '140px', height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: errors.birthCity ? '1px solid #ff4b4b' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px', color: '#ffffff', fontSize: '16px', padding: '0 15px', outline: 'none'
            }}
          />

          <input
            type="text"
            placeholder="Country"
            value={formData.birthCountry}
            onChange={(e) => handleInputChange('birthCountry', e.target.value)}
            style={{
              position: 'absolute', left: '206px', top: '529px', width: '140px', height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: errors.birthCountry ? '1px solid #ff4b4b' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px', color: '#ffffff', fontSize: '16px', padding: '0 15px', outline: 'none'
            }}
          />

          <div style={{
            WebkitTextStroke: '1px #000000', color: '#ffffff', fontFamily: '"Gotham Bold", Arial, sans-serif',
            fontSize: '20px', fontWeight: 'bold', position: 'absolute', left: '49px', top: '631px',
            width: '275px', letterSpacing: '-1.20px', lineHeight: '24px'
          }}>
            Before we dive in we need your cosmic coordinates.
          </div>

          <div style={{
            color: '#cccccc', fontFamily: '"Gotham Medium", Arial, sans-serif', fontSize: '15px', fontWeight: 500,
            position: 'absolute', left: '49px', top: '695px', width: '284px', letterSpacing: '-0.84px', lineHeight: '24px'
          }}>
            The more accurate the info, the more mind-blowingly spot-on your reading will be.
          </div>

          <div style={{ position: 'absolute', left: '50px', top: '758px' }}>
            <label style={{ color: '#ffffff', fontSize: '14px', fontFamily: '"Gotham Medium", Arial, sans-serif', display: 'block', marginBottom: '8px' }}>
              Birth Date
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              style={{
                width: '296px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: errors.birthDate ? '1px solid #ff4b4b' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px', color: '#ffffff', fontSize: '16px', padding: '0 15px', outline: 'none'
              }}
            />
          </div>

          <div style={{ position: 'absolute', left: '50px', top: '840px' }}>
            <label style={{ color: '#ffffff', fontSize: '14px', fontFamily: '"Gotham Medium", Arial, sans-serif', display: 'block', marginBottom: '8px' }}>
              Birth Time
            </label>
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) => handleInputChange('birthTime', e.target.value)}
              style={{
                width: '296px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: errors.birthTime ? '1px solid #ff4b4b' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px', color: '#ffffff', fontSize: '16px', padding: '0 15px', outline: 'none'
              }}
            />
          </div>

          {(coords.latitude || coords.longitude) && (
            <div style={{ position: 'absolute', left: '50px', top: '900px', fontSize: '12px', color: '#888' }}>
              Coordinates: {coords.latitude}, {coords.longitude}
            </div>
          )}

          <div style={{
            WebkitTextStroke: '1px #000000', color: '#ffffff', fontFamily: '"Gotham Bold", Arial, sans-serif',
            fontSize: '20px', fontWeight: 'bold', position: 'absolute', left: '61px', top: '921px',
            width: '220px', letterSpacing: '-1.20px', lineHeight: '24px'
          }}>
            The Accuracy of your time of birth?
          </div>

          <div style={{
            color: '#cccccc', fontFamily: '"Gotham Medium", Arial, sans-serif', fontSize: '15px', fontWeight: 500,
            position: 'absolute', left: '61px', top: '1005px', width: '284px', letterSpacing: '-0.84px', lineHeight: '24px'
          }}>
            The more precise you are, the deeper your astro-movie decoding…
          </div>

          <div style={{ position: 'absolute', left: '61px', top: '1140px' }}>
            {[
              { text: 'Exact time', icon: '⭐', note: ' (you legend!)' },
              { text: 'Within 30 minutes', icon: '🎯', note: '' },
              { text: 'Within 2 hours', icon: '⏰', note: '' },
              { text: 'Within half a day', icon: '🌅', note: '' },
              { text: 'Morning/Afternoon/Evening', icon: '🌤️', note: '' },
              { text: 'Just the date', icon: '📅', note: '' },
              { text: 'Around this time of year', icon: '🍂', note: '' },
              { text: 'Not sure at all', icon: '🤷', note: '' }
            ].map(option => (
              <label key={option.text} style={{
                display: 'flex', alignItems: 'center', color: '#ffffff',
                fontSize: '16px', fontFamily: '"Gotham Medium", Arial, sans-serif',
                marginBottom: '16px', cursor: 'pointer', gap: '12px'
              }}>
                <input
                  type="radio"
                  name="timeAccuracy"
                  value={option.text}
                  checked={formData.timeAccuracy === option.text}
                  onChange={(e) => handleInputChange('timeAccuracy', e.target.value)}
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                <span style={{ fontSize: '18px' }}>{option.icon}</span>
                <span>
                  {option.text}
                  {option.note && (
                    <span style={{ color: '#ffffff', fontStyle: 'italic', fontSize: '14px' }}>
                      {option.note}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>

          {(Object.keys(errors).length > 0 || loading) && (
            <div style={{ position: 'absolute', left: '50px', top: '1450px', fontSize: '12px', fontFamily: '"Gotham Medium", Arial, sans-serif' }}>
              {Object.entries(errors).map(([field, error], i) => (
                <div key={i} style={{ color: '#ff4b4b', marginBottom: '4px' }}>• {error}</div>
              ))}
              {loading && <div style={{ color: '#ff6600', marginTop: '8px' }}>⏳ Calculating your cosmic coordinates...</div>}
            </div>
          )}

          <div style={{ position: 'absolute', left: '50px', top: '1500px', display: 'flex', gap: '20px', width: '296px' }}>
            <button
              onClick={handlePrevious}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '25px', color: '#ffffff', fontSize: '16px',
                fontFamily: '"Gotham Medium", Arial, sans-serif', padding: '12px 24px', cursor: 'pointer', flex: 1
              }}
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#cccccc' : '#ff6600', border: 'none', borderRadius: '25px',
                color: '#ffffff', fontSize: '16px', fontFamily: '"Gotham Medium", Arial, sans-serif',
                fontWeight: '600', padding: '12px 24px', cursor: loading ? 'not-allowed' : 'pointer', flex: 1, opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Generating Chart...' : 'Get Chart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}