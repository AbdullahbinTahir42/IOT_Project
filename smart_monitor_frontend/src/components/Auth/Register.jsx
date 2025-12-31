import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      setSuccess('Account created successfully! Please check your email for verification.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join VoltSense Pro today</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={styles.success}>
              {success}
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
              placeholder="Create a strong password"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div style={styles.terms}>
            <input type="checkbox" id="terms" required style={styles.checkbox} />
            <label htmlFor="terms" style={styles.termsLabel}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
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
    filter: 'drop-shadow(0 0 10px #ffcc00)',
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
  terms: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '10px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#00d4ff',
  },
  termsLabel: {
    color: '#888',
    fontSize: '14px',
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
  error: {
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    color: '#ff0055',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid rgba(255, 0, 85, 0.2)',
  },
  success: {
    backgroundColor: 'rgba(0, 255, 153, 0.1)',
    color: '#00ff99',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid rgba(0, 255, 153, 0.2)',
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
};

export default Register;