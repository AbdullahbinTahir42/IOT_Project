import React, { useState } from 'react';
import axios from 'axios';

const ControlPanel = () => {
  const [fanSpeed, setFanSpeed] = useState('off');
  const [ledState, setLedState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFanSpeed = async (speed) => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      await axios.post('http://127.0.0.1:8000/control/fan', {
        speed: speed,
        user_id: localStorage.getItem('user_id')
      });
      setFanSpeed(speed);
      setMessage(`Fan set to ${speed}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error controlling fan');
    } finally {
      setLoading(false);
    }
  };

  const handleLedToggle = async () => {
    setLoading(true);
    try {
      const newState = !ledState;
      // Replace with your actual API endpoint
      await axios.post('http://127.0.0.1:8000/control/led', {
        state: newState,
        user_id: localStorage.getItem('user_id')
      });
      setLedState(newState);
      setMessage(`LED ${newState ? 'ON' : 'OFF'}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error controlling LED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Device Control</h3>
      
      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {/* Fan Control Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.icon}>🌀</div>
          <h4 style={styles.sectionTitle}>Fan Speed</h4>
        </div>
        <div style={styles.buttonGroup}>
          {['off', 'low', 'medium', 'high'].map((speed) => (
            <button
              key={speed}
              onClick={() => handleFanSpeed(speed)}
              disabled={loading}
              style={{
                ...styles.controlButton,
                ...(fanSpeed === speed ? styles.activeButton : {}),
                background: getFanButtonColor(speed)
              }}
            >
              {speed.charAt(0).toUpperCase() + speed.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* LED Control Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.icon}>💡</div>
          <h4 style={styles.sectionTitle}>LED Control</h4>
        </div>
        <div style={styles.buttonGroup}>
          <button
            onClick={handleLedToggle}
            disabled={loading}
            style={{
              ...styles.ledButton,
              ...(ledState ? styles.ledOn : styles.ledOff)
            }}
          >
            <span style={styles.ledIndicator}>
              <div style={{
                ...styles.ledDot,
                backgroundColor: ledState ? '#00ff99' : '#666',
                boxShadow: ledState ? '0 0 20px #00ff99' : 'none'
              }} />
            </span>
            <span>{ledState ? 'TURN OFF' : 'TURN ON'}</span>
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div style={styles.statusCard}>
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>Fan Status:</span>
          <span style={styles.statusValue}>{fanSpeed.toUpperCase()}</span>
        </div>
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>LED Status:</span>
          <span style={{
            ...styles.statusValue,
            color: ledState ? '#00ff99' : '#ff0055'
          }}>
            {ledState ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};

const getFanButtonColor = (speed) => {
  const colors = {
    off: 'linear-gradient(135deg, #666 0%, #444 100%)',
    low: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
    medium: 'linear-gradient(135deg, #ffcc00 0%, #ff9900 100%)',
    high: 'linear-gradient(135deg, #ff0055 0%, #cc0033 100%)'
  };
  return colors[speed] || colors.off;
};

const styles = {
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '25px',
    color: '#fff',
  },
  section: {
    marginBottom: '30px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  icon: {
    fontSize: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#fff',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  controlButton: {
    flex: 1,
    minWidth: '80px',
    padding: '14px 10px',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
  },
  activeButton: {
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  ledButton: {
    width: '100%',
    padding: '18px',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  ledOn: {
    background: 'linear-gradient(135deg, rgba(0, 255, 153, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)',
    border: '1px solid rgba(0, 255, 153, 0.3)',
  },
  ledOff: {
    background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.2) 0%, rgba(255, 204, 0, 0.2) 100%)',
    border: '1px solid rgba(255, 0, 85, 0.3)',
  },
  ledIndicator: {
    position: 'relative',
  },
  ledDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  statusCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  statusLabel: {
    color: '#888',
    fontSize: '14px',
  },
  statusValue: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
  },
  message: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    color: '#00d4ff',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid rgba(0, 212, 255, 0.2)',
  },
};

export default ControlPanel;