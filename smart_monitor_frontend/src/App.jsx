import React, { useState, useEffect, useRef, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
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
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

// --- CONFIGURATION & INIT ---

// 1. API Configuration (Centralized)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Initialize Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to prevent crash if keys are missing (Auth won't work, but UI loads)
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

// --- STYLES DEFINITION ---

const styles = {
  container: {
    backgroundColor: '#0f0f13',
    minHeight: '100vh',
    color: '#ffffff',
    fontFamily: '"Inter", sans-serif',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  icon: {
    fontSize: '32px',
    filter: 'drop-shadow(0 0 10px #ffcc00)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(to right, #fff, #aaa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#00d4ff',
    fontSize: '14px',
    verticalAlign: 'super',
    marginLeft: '5px',
    WebkitTextFillColor: '#00d4ff',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(0, 255, 153, 0.1)',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(0, 255, 153, 0.2)',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#00ff99',
    borderRadius: '50%',
    boxShadow: '0 0 10px #00ff99',
    animation: 'pulse 2s infinite',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#00d4ff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
  },
  userEmail: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  userStatus: {
    margin: 0,
    fontSize: '12px',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#00ff99',
    boxShadow: '0 0 8px #00ff99',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    border: '1px solid rgba(255, 0, 85, 0.2)',
    borderRadius: '10px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ff0055',
    transition: 'all 0.3s ease',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '25px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  metricIcon: {
    fontSize: '24px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
  },
  metricLabel: {
    color: '#888',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 8px 0',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '600',
    margin: 0,
    color: '#fff',
  },
  metricUnit: {
    fontSize: '14px',
    color: '#666',
    marginLeft: '4px',
    fontWeight: '400',
  },
  chartsGrid: {
    display: 'grid',
    // 2. Mobile Fix: Changed 400px to 300px to fit on phones
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
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
  controlCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
  },
  controlTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '25px',
    color: '#fff',
  },
  controlSection: {
    marginBottom: '30px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  controlIcon: {
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
};

const authStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f13',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    margin: 0,
  },
  form: {
    marginBottom: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    color: '#aaa',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#00d4ff',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#00d4ff',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    padding: 0,
  },
  error: {
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    color: '#ff0055',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  success: {
    backgroundColor: 'rgba(0, 255, 153, 0.1)',
    color: '#00ff99',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: '#888',
    fontSize: '14px',
    margin: 0,
  },
};

// Add Global CSS for animations
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 255, 153, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 255, 153, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 255, 153, 0); }
  }
`;
document.head.appendChild(styleSheet);


// --- AUTH CONTEXT ---

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = { signUp, signIn, signOut, user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// --- ROUTE COMPONENTS ---

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div style={styles.loadingContainer}>Loading...</div>;
  return user ? children : null;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return <div style={styles.loadingContainer}>Loading...</div>;
  return !user ? children : null;
};

// --- AUTH COMPONENTS ---

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div style={authStyles.container}>
        <div style={authStyles.card}>
          <div style={authStyles.header}>
            <div style={authStyles.logo}>⚡</div>
            <h2 style={authStyles.title}>Welcome Back</h2>
            <p style={authStyles.subtitle}>Sign in to your VoltSense account</p>
          </div>
          <form onSubmit={handleSubmit} style={authStyles.form}>
            {error && <div style={authStyles.error}>{error}</div>}
            <div style={authStyles.inputGroup}>
              <label style={authStyles.label}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={authStyles.input} placeholder="Enter your email" required />
            </div>
            <div style={authStyles.inputGroup}>
              <label style={authStyles.label}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={authStyles.input} placeholder="Enter your password" required />
            </div>
            <button type="submit" style={authStyles.button} disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
          </form>
          <div style={authStyles.footer}>
            <p style={authStyles.footerText}>Don't have an account? <button onClick={() => navigate('/register')} style={authStyles.linkButton}>Create Account</button></p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setSuccess(''); setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      setSuccess('Account created successfully! Please check your email.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div style={authStyles.container}>
        <div style={authStyles.card}>
          <div style={authStyles.header}>
            <div style={authStyles.logo}>⚡</div>
            <h2 style={authStyles.title}>Create Account</h2>
            <p style={authStyles.subtitle}>Join VoltSense Pro today</p>
          </div>
          <form onSubmit={handleSubmit} style={authStyles.form}>
            {error && <div style={authStyles.error}>{error}</div>}
            {success && <div style={authStyles.success}>{success}</div>}
            <div style={authStyles.inputGroup}>
              <label style={authStyles.label}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={authStyles.input} placeholder="Enter your email" required />
            </div>
            <div style={authStyles.inputGroup}>
              <label style={authStyles.label}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={authStyles.input} placeholder="Create a strong password" required />
            </div>
            <div style={authStyles.inputGroup}>
              <label style={authStyles.label}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={authStyles.input} placeholder="Confirm your password" required />
            </div>
            <button type="submit" style={authStyles.button} disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
          </form>
          <div style={authStyles.footer}>
            <p style={authStyles.footerText}>Already have an account? <button onClick={() => navigate('/login')} style={authStyles.linkButton}>Sign In</button></p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

// --- DASHBOARD COMPONENT ---

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [readings, setReadings] = useState([]);
  const [latest, setLatest] = useState(null);
  const [fanSpeed, setFanSpeed] = useState('off');
  const [ledState, setLedState] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate mock data for development
  const generateMockData = () => {
    const mockData = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now.getTime() - (29 - i) * 2 * 60 * 1000); 
      const voltage = 4.8 + Math.random() * 0.4; 
      const current = 0.15 + Math.random() * 0.35; 
      const power = voltage * current; 
      const temperature = 24 + Math.random() * 8; 
      
      mockData.push({
        id: i + 1,
        timestamp: timestamp.toISOString(),
        voltage: parseFloat(voltage.toFixed(3)),
        current: parseFloat(current.toFixed(3)),
        power: parseFloat(power.toFixed(3)),
        temperature: parseFloat(temperature.toFixed(1)),
        source: 'ESP32_Sensor',
        user_id: user?.id,
      });
    }
    return mockData;
  };

  const fetchData = async () => {
    try {
      // 3. Use Centralized API_URL
      const response = await axios.get(`${API_URL}/readings/`);
      const data = response.data;
      
      if (data && data.length > 0) {
        const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setReadings(sortedData);
        setLatest(sortedData[sortedData.length - 1]);
        
        // Sync controls with latest data if available
        if(sortedData[sortedData.length - 1].fan_status) {
           // Optional: You can sync UI with actual sensor state here if you want
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("Backend offline or error, using mock data for demo.");
      const mockData = generateMockData();
      setReadings(mockData);
      setLatest(mockData[mockData.length - 1]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // 4. IMPROVED CONTROL LOGIC (Optimistic Updates)
  const handleFanControl = async (speed) => {
    const previousSpeed = fanSpeed;
    setFanSpeed(speed); // Update UI immediately
    try {
      await axios.post(`${API_URL}/control/fan`, {
        speed: speed,
        user_id: user?.id
      });
    } catch (error) {
      console.error('Failed to control fan:', error);
      setFanSpeed(previousSpeed); // Revert on failure
    }
  };

  const handleLedControl = async () => {
    const previousState = ledState;
    const newState = !ledState;
    setLedState(newState); // Update UI immediately
    try {
      await axios.post(`${API_URL}/control/led`, {
        state: newState,
        user_id: user?.id
      });
    } catch (error) {
      console.error('Failed to control LED:', error);
      setLedState(previousState); // Revert on failure
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Chart configurations
  const powerChartData = {
    labels: readings.map((r) => new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [{
        label: 'Power Consumption (W)',
        data: readings.map((r) => r.power),
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#00d4ff',
    }],
  };

  const voltageCurrentData = {
    labels: readings.slice(-20).map((r) => new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    datasets: [
      {
        label: 'Voltage (V)',
        data: readings.slice(-20).map((r) => r.voltage),
        borderColor: '#ff0055',
        backgroundColor: 'rgba(255, 0, 85, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Current (A)',
        data: readings.slice(-20).map((r) => r.current),
        borderColor: '#ffcc00',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  const temperatureData = {
    labels: readings.map((r) => new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [{
        label: 'Temperature (°C)',
        data: readings.map((r) => r.temperature),
        backgroundColor: 'rgba(0, 255, 153, 0.3)',
        borderColor: '#00ff99',
        borderWidth: 2,
        fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#888', font: { family: "'Inter', sans-serif" } } } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#888', font: { family: "'Inter', sans-serif" } } },
      x: { grid: { display: false }, ticks: { color: '#888', font: { family: "'Inter', sans-serif" }, maxTicksLimit: 8 } },
    },
  };

  const voltageCurrentOptions = {
    ...chartOptions,
    scales: {
      y: { type: 'linear', display: true, position: 'left', grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#ff0055' }, title: { display: true, text: 'Voltage (V)', color: '#ff0055' } },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#ffcc00' }, title: { display: true, text: 'Current (A)', color: '#ffcc00' } },
      x: chartOptions.scales.x,
    },
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

  if (loading) return <div style={styles.loadingContainer}><div style={styles.spinner}></div><p style={styles.loadingText}>Loading your dashboard...</p></div>;

  return (
    <ProtectedRoute>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoGroup}>
            <span style={styles.icon}>⚡</span>
            <h1 style={styles.title}>VoltSense <span style={styles.subtitle}>Pro</span></h1>
            <div style={styles.statusBadge}>
              <div style={styles.pulseDot}></div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#00ff99' }}>SYSTEM ONLINE</span>
            </div>
          </div>
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>{user?.email?.charAt(0).toUpperCase()}</div>
              <div>
                <p style={styles.userEmail}>{user?.email}</p>
                <p style={styles.userStatus}><span style={styles.statusDot}></span> Online</p>
              </div>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </header>

        <div style={styles.metricsGrid}>
          {/* Metrics cards kept same as before */}
          <div style={{...styles.metricCard, borderLeft: '4px solid #ff0055'}}>
            <div style={{...styles.metricIcon, color: '#ff0055'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg></div>
            <div><p style={styles.metricLabel}>Voltage</p><h2 style={styles.metricValue}>{latest?.voltage !== undefined ? latest.voltage.toFixed(2) : '--'}<span style={styles.metricUnit}>V</span></h2></div>
          </div>
          <div style={{...styles.metricCard, borderLeft: '4px solid #ffcc00'}}>
            <div style={{...styles.metricIcon, color: '#ffcc00'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12M6 12h12"></path></svg></div>
            <div><p style={styles.metricLabel}>Current</p><h2 style={styles.metricValue}>{latest?.current !== undefined ? latest.current.toFixed(3) : '--'}<span style={styles.metricUnit}>A</span></h2></div>
          </div>
          <div style={{...styles.metricCard, borderLeft: '4px solid #00d4ff', background: 'linear-gradient(145deg, rgba(0, 212, 255, 0.15), rgba(0,0,0,0))'}}>
            <div style={{...styles.metricIcon, color: '#00d4ff'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg></div>
            <div><p style={styles.metricLabel}>Active Power</p><h2 style={{...styles.metricValue, textShadow: '0 0 20px #00d4ff'}}>{latest?.power !== undefined ? latest.power.toFixed(2) : '--'}<span style={styles.metricUnit}>W</span></h2></div>
          </div>
          <div style={{...styles.metricCard, borderLeft: '4px solid #00ff99'}}>
            <div style={{...styles.metricIcon, color: '#00ff99'}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg></div>
            <div><p style={styles.metricLabel}>Temperature</p><h2 style={styles.metricValue}>{latest?.temperature !== undefined ? latest.temperature.toFixed(1) : '--'}<span style={styles.metricUnit}>°C</span></h2></div>
          </div>
        </div>

        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}><h3 style={styles.chartTitle}>Power Consumption</h3><span style={styles.lastUpdated}>Updated: {latest ? new Date(latest.timestamp).toLocaleTimeString() : '--'}</span></div>
            <div style={styles.chartContainer}><Line data={powerChartData} options={chartOptions} /></div>
          </div>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}><h3 style={styles.chartTitle}>Voltage & Current</h3></div>
            <div style={styles.chartContainer}><Line data={voltageCurrentData} options={voltageCurrentOptions} /></div>
          </div>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}><h3 style={styles.chartTitle}>Temperature Trend</h3></div>
            <div style={styles.chartContainer}><Bar data={temperatureData} options={chartOptions} /></div>
          </div>

          <div style={styles.controlCard}>
            <h3 style={styles.controlTitle}>Device Control</h3>
            <div style={styles.controlSection}>
              <div style={styles.sectionHeader}><div style={styles.controlIcon}>🌀</div><h4 style={styles.sectionTitle}>Fan Speed</h4></div>
              <div style={styles.buttonGroup}>
                {['off', 'low', 'medium', 'high'].map((speed) => (
                  <button key={speed} onClick={() => handleFanControl(speed)} style={{...styles.controlButton, ...(fanSpeed === speed ? styles.activeButton : {}), background: getFanButtonColor(speed)}}>
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.controlSection}>
              <div style={styles.sectionHeader}><div style={styles.controlIcon}>💡</div><h4 style={styles.sectionTitle}>LED Control</h4></div>
              <div style={styles.buttonGroup}>
                <button onClick={handleLedControl} style={{...styles.ledButton, ...(ledState ? styles.ledOn : styles.ledOff)}}>
                  <span style={styles.ledIndicator}><div style={{...styles.ledDot, backgroundColor: ledState ? '#00ff99' : '#666', boxShadow: ledState ? '0 0 20px #00ff99' : 'none'}} /></span>
                  <span>{ledState ? 'TURN OFF' : 'TURN ON'}</span>
                </button>
              </div>
            </div>
            <div style={styles.statusCard}>
              <div style={styles.statusItem}><span style={styles.statusLabel}>Fan Status:</span><span style={styles.statusValue}>{fanSpeed.toUpperCase()}</span></div>
              <div style={styles.statusItem}><span style={styles.statusLabel}>LED Status:</span><span style={{...styles.statusValue, color: ledState ? '#00ff99' : '#ff0055'}}>{ledState ? 'ON' : 'OFF'}</span></div>
              <div style={styles.statusItem}><span style={styles.statusLabel}>Last Update:</span><span style={styles.statusValue}>{latest ? new Date(latest.timestamp).toLocaleTimeString() : '--'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// --- APP ENTRY POINT ---

const LoadingScreen = () => (
  <div style={styles.loadingContainer}><div style={styles.spinner}></div><p style={styles.loadingText}>Loading...</p></div>
);

function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;