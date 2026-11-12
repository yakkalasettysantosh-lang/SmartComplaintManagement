import React from 'react';
import { ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 1.5rem 1.5rem',
        marginTop: 'auto'
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              SmartResolve
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            A transparent, accountable complaint tracking & resolution portal for academic institutions and organizations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <li><Link to="/#features" style={{ color: 'var(--text-secondary)' }}>Key Features</Link></li>
            <li><Link to="/#how-it-works" style={{ color: 'var(--text-secondary)' }}>How it Works</Link></li>
            <li><Link to="/login" style={{ color: 'var(--text-secondary)' }}>Sign In to Portal</Link></li>
            <li><Link to="/register" style={{ color: 'var(--text-secondary)' }}>Create Account</Link></li>
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Core Categories</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li>Academic Grievances</li>
            <li>IT & Network Infrastructure</li>
            <li>Hostel & Campus Facilities</li>
            <li>Administrative & Accounts</li>
          </ul>
        </div>

        {/* Help & Contact */}
        <div id="contact">
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Support Desk</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color="var(--primary)" /> support@complaints.org
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="var(--primary)" /> +91 (0) 80 2345 6789
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={15} color="var(--primary)" /> Central Administration Block
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}
      >
        <p>&copy; {new Date().getFullYear()} Smart Complaint Management System. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          Built with MERN Stack <Heart size={14} color="#ef4444" fill="#ef4444" /> for Transparent Governance
        </p>
      </div>
    </footer>
  );
};

export default Footer;
