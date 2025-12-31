import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚡</span>
            <h1 style={styles.logoText}>VoltSense<span style={styles.logoPro}>Pro</span></h1>
          </div>
          
          <h2 style={styles.heroTitle}>
            Intelligent Power Monitoring & Control System
          </h2>
          
          <p style={styles.heroSubtitle}>
            Real-time monitoring of voltage, current, power, and temperature with 
            remote control capabilities for your IoT devices.
          </p>
          
          <div style={styles.ctaButtons}>
            <button
              onClick={() => navigate('/register')}
              style={styles.primaryButton}
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              style={styles.secondaryButton}
            >
              Sign In
            </button>
          </div>
        </div>
        
        <div style={styles.heroVisual}>
          <div style={styles.dashboardPreview}>
            {/* Mock dashboard preview */}
            <div style={styles.mockCard}>
              <div style={styles.mockChart}></div>
            </div>
            <div style={styles.mockCard}>
              <div style={styles.mockMetrics}></div>
            </div>
            <div style={styles.mockCard}>
              <div style={styles.mockControls}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.features}>
        <h3 style={styles.sectionTitle}>Key Features</h3>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h4 style={styles.featureTitle}>{feature.title}</h4>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 VoltSense Pro. All rights reserved.
        </p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy Policy</a>
          <a href="#" style={styles.footerLink}>Terms of Service</a>
          <a href="#" style={styles.footerLink}>Contact</a>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: '📊',
    title: 'Real-time Monitoring',
    description: 'Live updates of voltage, current, power, and temperature every 2 seconds.',
  },
  {
    icon: '🎛️',
    title: 'Remote Control',
    description: 'Control your fan speed and LED lights remotely from anywhere.',
  },
  {
    icon: '📈',
    title: 'Advanced Analytics',
    description: 'Detailed charts and graphs to analyze your power consumption patterns.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your data is encrypted and accessible only to you with user authentication.',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    description: 'Access your dashboard from any device - desktop, tablet, or mobile.',
  },
  {
    icon: '⚡',
    title: 'Energy Insights',
    description: 'Get valuable insights to optimize your energy usage and save costs.',
  },
];

const styles = {
  container: {
    backgroundColor: '#0f0f13',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '90vh',
    padding: '40px 20px',
    textAlign: 'center',
    background: 'radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
  },
  heroContent: {
    maxWidth: '800px',
    marginBottom: '60px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '40px',
  },
  logoIcon: {
    fontSize: '64px',
    filter: 'drop-shadow(0 0 20px #ffcc00)',
  },
  logoText: {
    fontSize: '48px',
    fontWeight: '800',
    margin: 0,
    background: 'linear-gradient(to right, #fff, #aaa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoPro: {
    color: '#00d4ff',
    fontSize: '16px',
    marginLeft: '8px',
    WebkitTextFillColor: '#00d4ff',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 0 20px 0',
    lineHeight: '1.2',
    background: 'linear-gradient(90deg, #fff 0%, #00d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#aaa',
    margin: '0 0 40px 0',
    lineHeight: '1.6',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '18px 36px',
    backgroundColor: '#00d4ff',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0, 212, 255, 0.3)',
  },
  primaryButtonHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 40px rgba(0, 212, 255, 0.4)',
  },
  secondaryButton: {
    padding: '18px 36px',
    backgroundColor: 'transparent',
    color: '#00d4ff',
    border: '2px solid #00d4ff',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  secondaryButtonHover: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  heroVisual: {
    marginTop: '40px',
  },
  dashboardPreview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '800px',
  },
  mockCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    height: '150px',
  },
  mockChart: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: '8px',
  },
  mockMetrics: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 255, 153, 0.1)',
    borderRadius: '8px',
  },
  mockControls: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    borderRadius: '8px',
  },
  features: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    margin: '0 0 60px 0',
    background: 'linear-gradient(90deg, #fff 0%, #00d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  featureCardHover: {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 15px 0',
    color: '#fff',
  },
  featureDescription: {
    fontSize: '14px',
    color: '#aaa',
    lineHeight: '1.6',
    margin: 0,
  },
  footer: {
    padding: '40px 20px',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: '#888',
    fontSize: '14px',
    margin: '0 0 20px 0',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.3s ease',
  },
  footerLinkHover: {
    color: '#00d4ff',
  },
};

// Add global styles
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  
  button {
    font-family: inherit;
  }
  
  a {
    text-decoration: none;
  }
`;
document.head.appendChild(styleSheet);

export default Home;