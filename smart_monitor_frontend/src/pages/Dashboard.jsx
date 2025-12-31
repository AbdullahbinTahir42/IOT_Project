import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
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
import { Line, Bar } from 'react-chartjs-2';
import MetricsCards from '../components/Dashboard/MetricsCards';
import ControlPanel from '../components/Dashboard/ControlPanel';
import Navbar from '../components/Layout/Navbar';

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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [readings, setReadings] = useState([]);
  const [latest, setLatest] = useState(null);
  const [timeRange, setTimeRange] = useState('1h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Add user-specific endpoint with user_id parameter
      const response = await axios.get('http://127.0.0.1:8000/readings/', {
        params: {
          user_id: user.id,
          time_range: timeRange
        }
      });
      const data = response.data;
      
      if (data && data.length > 0) {
        const sortedData = [...data].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        setReadings(sortedData);
        setLatest(sortedData[sortedData.length - 1]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      const interval = setInterval(fetchUserData, 2000);
      return () => clearInterval(interval);
    }
  }, [user, timeRange]);

  // Power Chart Data
  const powerChartData = {
    labels: readings.map(r => 
      new Date(r.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ),
    datasets: [
      {
        label: 'Power (W)',
        data: readings.map(r => r.power),
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#00d4ff',
      },
    ],
  };

  // Voltage/Current Chart Data
  const voltageCurrentData = {
    labels: readings.slice(-20).map(r => 
      new Date(r.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Voltage (V)',
        data: readings.slice(-20).map(r => r.voltage),
        borderColor: '#ff0055',
        backgroundColor: 'rgba(255, 0, 85, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Current (A)',
        data: readings.slice(-20).map(r => r.current),
        borderColor: '#ffcc00',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  // Temperature Chart Data
  const temperatureData = {
    labels: readings.map(r => 
      new Date(r.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: readings.map(r => r.temperature),
        backgroundColor: 'rgba(0, 255, 153, 0.3)',
        borderColor: '#00ff99',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#888',
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#888',
          font: {
            family: "'Inter', sans-serif",
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
  };

  const voltageCurrentOptions = {
    ...chartOptions,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ff0055',
        },
        title: {
          display: true,
          text: 'Voltage (V)',
          color: '#ff0055',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#ffcc00',
        },
        title: {
          display: true,
          text: 'Current (A)',
          color: '#ffcc00',
        },
      },
      x: chartOptions.scales.x,
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar user={user} onLogout={signOut} />
      
      <div style={styles.header}>
        <div>
          <h1 style={styles.greeting}>
            Welcome back, <span style={styles.userName}>{user?.email?.split('@')[0]}</span>
          </h1>
          <p style={styles.subtitle}>Real-time monitoring & control panel</p>
        </div>
        
        <div style={styles.timeRangeSelector}>
          <button
            onClick={() => setTimeRange('1h')}
            style={{
              ...styles.timeButton,
              ...(timeRange === '1h' && styles.timeButtonActive)
            }}
          >
            1H
          </button>
          <button
            onClick={() => setTimeRange('6h')}
            style={{
              ...styles.timeButton,
              ...(timeRange === '6h' && styles.timeButtonActive)
            }}
          >
            6H
          </button>
          <button
            onClick={() => setTimeRange('24h')}
            style={{
              ...styles.timeButton,
              ...(timeRange === '24h' && styles.timeButtonActive)
            }}
          >
            24H
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            style={{
              ...styles.timeButton,
              ...(timeRange === '7d' && styles.timeButtonActive)
            }}
          >
            7D
          </button>
        </div>
      </div>

      <MetricsCards latest={latest} />

      <div style={styles.chartsGrid}>
        {/* Power Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Power Consumption</h3>
            <span style={styles.lastUpdated}>
              Updated: {latest ? new Date(latest.timestamp).toLocaleTimeString() : '--'}
            </span>
          </div>
          <div style={styles.chartContainer}>
            <Line data={powerChartData} options={chartOptions} />
          </div>
        </div>

        {/* Voltage & Current Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Voltage & Current</h3>
          </div>
          <div style={styles.chartContainer}>
            <Line data={voltageCurrentData} options={voltageCurrentOptions} />
          </div>
        </div>

        {/* Temperature Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Temperature Trend</h3>
          </div>
          <div style={styles.chartContainer}>
            <Line data={temperatureData} options={chartOptions} />
          </div>
        </div>

        {/* Control Panel */}
        <div style={styles.chartCard}>
          <ControlPanel />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f0f13',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: '"Inter", sans-serif',
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f0f13',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(0, 212, 255, 0.1)',
    borderTop: '4px solid #00d4ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#888',
    fontSize: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  greeting: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    background: 'linear-gradient(to right, #fff, #aaa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  userName: {
    color: '#00d4ff',
    WebkitTextFillColor: '#00d4ff',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    margin: 0,
  },
  timeRangeSelector: {
    display: 'flex',
    gap: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '4px',
    borderRadius: '12px',
  },
  timeButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  timeButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    color: '#00d4ff',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '25px',
    marginTop: '30px',
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#fff',
  },
  lastUpdated: {
    fontSize: '12px',
    color: '#666',
  },
  chartContainer: {
    height: '250px',
    width: '100%',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @media (max-width: 768px) {
    div[style*="gridTemplateColumns: repeat(auto-fit, minmax(400px, 1fr))"] {
      grid-template-columns: 1fr !important;
    }
    div[style*="display: flex; justify-content: space-between;"] {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;