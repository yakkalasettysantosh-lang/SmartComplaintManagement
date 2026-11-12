import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Bell,
  ArrowRight,
  TrendingUp,
  Lock,
  Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'staff') return '/staff';
    return '/dashboard';
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
          padding: '5rem 1.5rem 4rem',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              letterSpacing: '0.02em'
            }}
          >
            <ShieldCheck size={16} /> SMART GRIEVANCE & COMPLAINT TRACKING
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              color: 'var(--text-main)',
              letterSpacing: '-0.03em'
            }}
          >
            Transparent, Accountable & <br />
            <span style={{ color: 'var(--primary)' }}>Rapid Issue Resolution</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: 700,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            No more ignored emails or lost paperwork. SmartResolve bridges students, employees,
            department staff, and administrators into an automated, transparent resolution workflow.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            {isAuthenticated ? (
              <Link to={getDashboardLink()} className="btn btn-primary btn-lg">
                Go to Dashboard
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Submit a Complaint Now
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In to Track
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. Key Problem Statement & Solution Highlights */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Why Smart Complaint Management?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto' }}>
            In traditional organizations and colleges, complaints get delayed, overlooked, or lack transparency.
            Our platform solves this with full audit trails.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}
        >
          <div className="card">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Real-Time Status Tracking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every status shift from Pending, to In Progress, to Resolved is timestamped with responsible officer details.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Automated Staff Assignment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Administrators assign complaints directly to specialized departmental staff (IT, Maintenance, Hostel, Academic).
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <Bell size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Instant Notifications</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Complainants and staff receive immediate updates when progress remarks or status changes are made.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section
        id="how-it-works"
        style={{
          backgroundColor: '#ffffff',
          padding: '4.5rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Simple 4-Step Process
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.35rem' }}>How the Platform Operates</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem'
            }}
          >
            {[
              {
                step: '01',
                title: 'Submit Complaint',
                desc: 'Select department, priority, write description, and upload photo or document proof.'
              },
              {
                step: '02',
                title: 'Admin Verification',
                desc: 'Central administrator reviews grievance and assigns to the right department staff.'
              },
              {
                step: '03',
                title: 'Staff Action & Remarks',
                desc: 'Assigned staff investigates the issue, posts progress notes, and begins corrective action.'
              },
              {
                step: '04',
                title: 'Resolution & Audit',
                desc: 'Issue is marked resolved with full summary, timestamped audit log, and user feedback.'
              }
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  position: 'relative',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'var(--primary-subtle)',
                    lineHeight: 1,
                    marginBottom: '0.75rem'
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" style={{ padding: '4.5rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Key Capabilities & Security</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto' }}>
            Built strictly adhering to modern web security, role-based authorization, and transparent governance standards.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Lock size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Role-Based Access Control</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Granular authorization ensures students only see their complaints, staff see their assigned tasks, and admins manage systemic policy.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <FileText size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Attachment Proofs</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Upload photos, equipment tags, or PDF invoices directly to substantiate complaints.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <TrendingUp size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Administrative Analytics</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Track department performance, recurrence bottlenecks, and resolution percentage graphs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
          color: '#ffffff',
          padding: '4rem 1.5rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '1rem' }}>
            Ready to lodge or resolve complaints?
          </h2>
          <p style={{ color: '#dbeafe', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Join campus students, staff, and management on the unified grievance resolution portal.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700,
                padding: '0.85rem 1.75rem',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontWeight: 600,
                padding: '0.85rem 1.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              Portal Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
