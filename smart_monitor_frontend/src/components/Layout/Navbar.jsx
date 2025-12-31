import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <div style={styles.navbar}>
      <div style={styles.logoGroup}>
        <span style={styles.logoIcon}>⚡</span>
        <h2 style={styles.logoText}>VoltSense<span style={styles.logoSub}>Pro</span></h2>
      </div>
      
      <div style={styles.userSection}>
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.userEmail}>{user?.email}</p>
            <p style={styles.userStatus}>
              <span style={styles.statusDot}></span>
              Online
            </p>
          </div>
        </div>
        <button onClick={onLogout} style={styles.logoutButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    marginBottom: '30px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '28px',
    filter: 'drop-shadow(0 0 10px #ffcc00)',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(to right, #fff, #aaa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoSub: {
    color: '#00d4ff',
    fontSize: '12px',
    marginLeft: '4px',
    WebkitTextFillColor: '#00d4ff',
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
};

export default Navbar;