import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PowerChart = ({ data, timeRange }) => {
  // Process data for chart
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
        label: 'Power Consumption (W)',
        data: data.map(r => r.power),
        borderColor: '#00d4ff',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 212, 255, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: 'Average',
        data: data.map(() => {
          const avg = data.reduce((sum, r) => sum + (r.power || 0), 0) / data.length;
          return avg;
        }),
        borderColor: '#ffcc00',
        borderWidth: 1,
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
        titleColor: '#00d4ff',
        bodyColor: '#fff',
        borderColor: '#00d4ff',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} W`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#888',
          font: {
            family: "'Inter', sans-serif",
          },
          callback: (value) => `${value} W`,
        },
        title: {
          display: true,
          text: 'Power (W)',
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
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 0, // Disable animations for real-time updates
    },
    elements: {
      line: {
        cubicInterpolationMode: 'monotone',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Power Consumption Trend</h3>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Current:</span>
            <span style={styles.statValue}>
              {data.length > 0 ? data[data.length - 1].power.toFixed(2) : '--'} W
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Avg:</span>
            <span style={styles.statValue}>
              {data.length > 0 
                ? (data.reduce((sum, r) => sum + r.power, 0) / data.length).toFixed(2)
                : '--'
              } W
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Peak:</span>
            <span style={styles.statValue}>
              {data.length > 0 
                ? Math.max(...data.map(r => r.power)).toFixed(2)
                : '--'
              } W
            </span>
          </div>
        </div>
      </div>
      <div style={styles.chartWrapper}>
        <Line data={chartData} options={options} />
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
    margin: 0,
    color: '#fff',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#00d4ff',
  },
  chartWrapper: {
    height: 'calc(100% - 70px)',
    minHeight: '300px',
  },
};

export default PowerChart;