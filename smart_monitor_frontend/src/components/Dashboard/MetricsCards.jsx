import React from 'react';

const MetricsCards = ({ latest }) => {
  const cards = [
    {
      label: 'Voltage',
      value: latest?.voltage || '--',
      unit: 'V',
      color: '#ff0055',
      icon: '⚡',
      trend: '+2.3%',
    },
    {
      label: 'Current',
      value: latest?.current || '--',
      unit: 'A',
      color: '#ffcc00',
      icon: '🌀',
      trend: '-1.5%',
    },
    {
      label: 'Active Power',
      value: latest?.power || '--',
      unit: 'W',
      color: '#00d4ff',
      icon: '📊',
      trend: '+4.2%',
      highlight: true,
    },
    {
      label: 'Temperature',
      value: latest?.temperature || '--',
      unit: '°C',
      color: '#00ff99',
      icon: '🌡️',
      trend: '+0.8°C',
    },
    {
      label: 'Energy Today',
      value: latest?.energy_today || '0.42',
      unit: 'kWh',
      color: '#9d4edd',
      icon: '🔋',
      trend: '+12%',
    },
    {
      label: 'Device Status',
      value: latest?.status || 'Online',
      unit: '',
      color: '#00ff99',
      icon: '✅',
      trend: '',
      isStatus: true,
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            ...styles.card,
            borderLeft: `4px solid ${card.color}`,
            background: card.highlight
              ? 'linear-gradient(145deg, rgba(0, 212, 255, 0.15), rgba(0,0,0,0))'
              : 'rgba(255, 255, 255, 0.03)',
            boxShadow: card.highlight ? '0 8px 32px rgba(0, 212, 255, 0.1)' : 'none',
          }}
        >
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, color: card.color }}>
              {card.icon}
            </div>
            <span style={{ ...styles.trend, color: card.trend?.startsWith('+') ? '#00ff99' : '#ff0055' }}>
              {card.trend}
            </span>
          </div>
          
          <div style={styles.cardContent}>
            <p style={styles.label}>{card.label}</p>
            <div style={styles.valueContainer}>
              <h2 style={{
                ...styles.value,
                color: card.isStatus ? (card.value === 'Online' ? '#00ff99' : '#ff0055') : '#fff',
                textShadow: card.highlight ? `0 0 20px ${card.color}` : 'none'
              }}>
                {card.value}
                {card.unit && <span style={styles.unit}>{card.unit}</span>}
              </h2>
            </div>
            
            {!card.isStatus && (
              <div style={styles.progressBar}>
                <div
                  style={{
                    width: `${Math.min(Math.abs(card.value || 0) * 10, 100)}%`,
                    backgroundColor: card.color,
                    height: '4px',
                    borderRadius: '2px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
  },
  trend: {
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#888',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: 0,
    fontWeight: '500',
  },
  valueContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  value: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0',
    lineHeight: '1',
  },
  unit: {
    fontSize: '14px',
    color: '#666',
    marginLeft: '4px',
    fontWeight: '400',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    marginTop: '10px',
    overflow: 'hidden',
  },
};

export default MetricsCards;