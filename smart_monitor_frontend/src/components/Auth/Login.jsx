import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>⚡</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your VoltSense account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <div style={styles.backgroundPattern}></div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f13',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
    zIndex: 0,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '20px',
    display: 'inline-block',
    animation: 'float 3s ease-in-out infinite',
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
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    borderColor: '#00d4ff',
    boxShadow: '0 0 0 2px rgba(0, 212, 255, 0.2)',
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
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: '#00b8e6',
    transform: 'translateY(-2px)',
  },
  error: {
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    color: '#ff0055',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid rgba(255, 0, 85, 0.2)',
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
  link: {
    color: '#00d4ff',
    textDecoration: 'none',
    fontWeight: '600',
  },
  linkHover: {
    textDecoration: 'underline',
  },
};

export default Login;