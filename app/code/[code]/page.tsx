'use client';

import { useEffect, useState } from 'react';

interface Link {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked: string | null;
  updatedAt: string;
}

export default function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [code, setCode] = useState<string | null>(null);
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ code }) => setCode(code));
  }, [params]);

  useEffect(() => {
    if (!code) return;
    
    const fetchLink = async () => {
      try {
        const res = await fetch(`/api/links/${code}`);
        if (!res.ok) throw new Error('Link not found');
        const data = await res.json();
        setLink(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [code]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 25%, #16213e 50%, #0f3460 75%, #1e1b4b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-150px', right: '-50px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
        </div>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>Loading link details...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 25%, #16213e 50%, #0f3460 75%, #1e1b4b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
        padding: '20px',
      }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-150px', right: '-50px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
        </div>
        <div style={{ maxWidth: '500px', textAlign: 'center', position: 'relative', zIndex: 10, borderRadius: '20px', padding: '40px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)', animation: 'fadeIn 0.6s ease-out' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>❌</p>
          <p style={{ color: '#fca5a5', fontWeight: '600', marginBottom: '24px', fontSize: '16px' }}>{error || 'Link not found'}</p>
          <a href="/" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', color: '#ffffff', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(99, 102, 241, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>Back to Dashboard</a>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const shortUrl = `${baseUrl}/${link.code}`;
  const createdDate = new Date(link.createdAt);
  const lastClickedDate = link.lastClicked ? new Date(link.lastClicked) : null;
  const daysOld = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const clicksPerDay = (link.clicks / Math.max(1, daysOld)).toFixed(1);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 25%, #16213e 50%, #0f3460 75%, #1e1b4b 100%)',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
      `}</style>

      {/* Animated background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)', animation: 'pulse 8s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', bottom: '-150px', right: '-50px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)', animation: 'pulse 10s ease-in-out infinite 2s' }}></div>
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)', animation: 'pulse 12s ease-in-out infinite 4s' }}></div>
      </div>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)', background: 'rgba(10, 14, 39, 0.7)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)', padding: '16px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6366f1', textDecoration: 'none', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#ec4899'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6366f1'; }}>← Back to Dashboard</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(34, 197, 94, 0.1)', color: '#86efac', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(34, 197, 94, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86efac', animation: 'pulse 2s ease-in-out infinite' }}></span>Live</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section style={{ padding: '60px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {/* Code Card */}
            <div style={{ borderRadius: '20px', padding: '32px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)', animation: 'slideInLeft 0.6s ease-out', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 30px 80px rgba(99, 102, 241, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.15)'; }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '16px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Short Code</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: '40px', fontWeight: '900', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'monospace', letterSpacing: '2px' }}>{link.code}</code>
                <button onClick={() => { navigator.clipboard.writeText(shortUrl); alert('Copied!'); }} style={{ fontSize: '24px', cursor: 'pointer', transition: 'all 0.2s ease', background: 'none', border: 'none' }} onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.2)'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}>📋</button>
              </div>
            </div>

            {/* Clicks Card */}
            <div style={{ borderRadius: '20px', padding: '32px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)', animation: 'fadeIn 0.6s ease-out 0.1s both', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 30px 80px rgba(99, 102, 241, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.15)'; }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '16px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Total Clicks</p>
              <p style={{ fontSize: '48px', fontWeight: '900', color: '#22d3ee', marginBottom: '8px' }}>{link.clicks.toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>📈 Click tracking active</p>
            </div>

            {/* Last Clicked Card */}
            <div style={{ borderRadius: '20px', padding: '32px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)', animation: 'slideInRight 0.6s ease-out', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 30px 80px rgba(99, 102, 241, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.15)'; }}>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '16px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Last Activity</p>
              <p style={{ fontSize: '32px', fontWeight: '900', color: '#f59e0b', marginBottom: '8px' }}>{lastClickedDate ? lastClickedDate.toLocaleDateString() : 'No clicks'}</p>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>⏰ {lastClickedDate ? lastClickedDate.toLocaleTimeString() : 'Waiting...'}</p>
            </div>
          </div>

          {/* Details Card */}
          <div style={{ borderRadius: '20px', padding: '40px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)', animation: 'fadeIn 0.8s ease-out 0.2s both' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#f1f5f9', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔗</div>
              Link Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Short URL */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '12px', color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Short URL</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                  <code style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all' }}>{shortUrl}</code>
                  <button onClick={() => { navigator.clipboard.writeText(shortUrl); alert('Copied!'); }} style={{ padding: '12px 20px', borderRadius: '12px', fontWeight: '700', color: '#ffffff', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)', fontSize: '14px', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.3)'; }}>Copy</button>
                </div>
              </div>

              {/* Target URL */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '12px', color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Destination URL</label>
                <a href={link.targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#6366f1', textDecoration: 'none', fontSize: '13px', wordBreak: 'break-all', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#ec4899'; e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'; }}>{link.targetUrl}</a>
              </div>

              {/* Timeline */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', paddingTop: '20px', borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>📅 Created</p>
                  <p style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9' }}>{createdDate.toLocaleDateString()}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{createdDate.toLocaleTimeString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>🔄 Last Updated</p>
                  <p style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9' }}>{new Date(link.updatedAt).toLocaleDateString()}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{new Date(link.updatedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', marginBottom: '20px' }}>📈 Performance Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderRadius: '14px', padding: '20px', textAlign: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Age</p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#6366f1' }}>{daysOld}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>days old</p>
                </div>
                <div style={{ background: 'rgba(34, 211, 238, 0.1)', borderRadius: '14px', padding: '20px', textAlign: 'center', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                  <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Clicks/Day</p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#22d3ee' }}>{clicksPerDay}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>per day</p>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '14px', padding: '20px', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Status</p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#86efac' }}>✅</p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px' }}>
            <a href="/" style={{ padding: '14px 24px', borderRadius: '12px', fontWeight: '700', color: '#ffffff', textDecoration: 'none', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.05)', transition: 'all 0.3s ease', textAlign: 'center', fontSize: '14px' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>Back to Dashboard</a>
            <a href={link.targetUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '14px 24px', borderRadius: '12px', fontWeight: '700', color: '#ffffff', textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)', transition: 'all 0.3s ease', textAlign: 'center', fontSize: '14px' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.3)'; }}>Visit Link →</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(99, 102, 241, 0.2)', backdropFilter: 'blur(20px)', background: 'rgba(10, 14, 39, 0.7)', marginTop: '60px', padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', position: 'relative', zIndex: 10 }}>
        <p style={{ margin: 0, fontWeight: '600' }}>Built with ❤️ using Next.js, React & PostgreSQL</p>
        <p style={{ marginTop: '12px', color: '#64748b', margin: 0, fontSize: '12px', fontWeight: '500' }}>© {new Date().getFullYear()} TinyLink. All rights reserved.</p>
      </footer>
    </div>
  );
}
