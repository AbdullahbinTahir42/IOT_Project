import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TemperatureChart = ({ data, timeRange }) => {
  const temperatures = data.map(r => r.temperature);
  const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
  
  const chartData = {
    labels: data.map(r => {
      if (timeRange === '1h' || timeRange === '6h') {
        return new Date(r.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        return new Date(r.timestamp).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit'
        });
      }
    }),
    datasets: [
      {
        label: 'Temperature',
        data: temperatures,
        backgroundColor: (context) => {
          const value = context.raw;
          const alpha = Math.min(0.3 + (value - Math.min(...temperatures)) / 
            (Math.max(...temperatures) - Math.min(...temperatures)) * 0.4, 0.7);
          return `rgba(0, 255, 153, ${alpha})`;
        },
        borderColor: '#00ff99',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#00ff99',
        pointBorderColor: '#000',
        pointBorderWidth: 2,
      },
      {
        type: 'line',
        label: 'Average',
        data: data.map(() => avgTemp),
        borderColor: '#ffcc00',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#888',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#00ff99',
        bodyColor: '#fff',
        borderColor: '#00ff99',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}°C`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#888',
          font: {
            family: "'Inter', sans-serif",
          },
          callback: (value) => `${value}°C`,
        },
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#888',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#888',
          font: {
            family: "'Inter', sans-serif",
          },
          maxTicksLimit: 8,
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  // Calculate temperature statistics
  const tempStats = {
    current: temperatures.length > 0 ? temperatures[temperatures.length - 1] : null,
    min: temperatures.length > 0 ? Math.min(...temperatures) : null,
    max: temperatures.length > 0 ? Math.max(...temperatures) : null,
    avg: avgTemp,
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Temperature Monitoring</h3>
          <p style={styles.subtitle}>Real-time thermal tracking</p>
        </div>
        
        <div style={styles.tempIndicators}>
          <div style={styles.tempIndicator}>
            <div style={{ ...styles.indicatorDot, backgroundColor: '#00ff99' }} />
            <div style={styles.indicatorText}>
              <span style={styles.indicatorLabel}>Current</span>
              <span style={styles.indicatorValue}>
                {tempStats.current ? `${tempStats.current.toFixed(1)}°C` : '--'}
              </span>
            </div>
          </div>
          <div style={styles.tempIndicator}>
            <div style={{ ...styles.indicatorDot, backgroundColor: '#ffcc00' }} />
            <div style={styles.indicatorText}>
              <span style={styles.indicatorLabel}>Average</span>
              <span style={styles.indicatorValue}>
                {tempStats.avg ? `${tempStats.avg.toFixed(1)}°C` : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.chartWrapper}>
        <Bar data={chartData} options={options} />
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Min Temperature</span>
          <span style={styles.statValue}>
            {tempStats.min ? `${tempStats.min.toFixed(1)}°C` : '--'}
          </span>
        </div>
          <div style={styles.statCard}>
          <span style={styles.statLabel}>Max Temperature</span>
          <span style={{ ...styles.statValue, color: '#ff0055' }}>
            {tempStats.max ? `${tempStats.max.toFixed(1)}°C` : '--'}
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Range</span>
          <span style={styles.statValue}>
            {tempStats.min && tempStats.max 
              ? `${(tempStats.max - tempStats.min).toFixed(1)}°C` 
              : '--'
            }
          </span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Trend</span>
          <span style={styles.statValue}>
            {temperatures.length >= 2 
              ? temperatures[temperatures.length - 1] > temperatures[temperatures.length - 2]
                ? '↗ Rising'
                : temperatures[temperatures.length - 1] < temperatures[temperatures.length - 2]
                ? '↘ Falling'
                : '→ Stable'
              : '--'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 5px 0',
    color: '#fff',
  },
  subtitle: {
    fontSize: '12px',
    color: '#888',
    margin: 0,
  },
  tempIndicators: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  tempIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  indicatorDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor',
  },
  indicatorText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  indicatorLabel: {
    fontSize: '11px',
    color: '#888',
  },
  indicatorValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
  },
  chartWrapper: {
    height: '250px',
    marginBottom: '25px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#00ff99',
    textAlign: 'center',
  },
};

export default TemperatureChart;