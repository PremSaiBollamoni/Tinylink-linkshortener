'use client';

import { useState, useEffect } from 'react';

interface Link {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked: string | null;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dbConnected, setDbConnected] = useState(true);

  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLinks();
    const interval = setInterval(fetchLinks, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/links');
      if (!res.ok) {
        if (res.status === 500) {
          setDbConnected(false);
          setError('Database not connected. Please configure your Neon database.');
          setLinks([]);
        } else {
          throw new Error('Failed to fetch links');
        }
      } else {
        const data = await res.json();
        setLinks(data);
        setDbConnected(true);
        setError(null);
      }
    } catch (err) {
      setDbConnected(false);
      setError('Database connection failed. Demo mode enabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!targetUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!dbConnected) {
      setError('Database not connected. Cannot create links.');
      return;
    }

    setIsSubmitting(true);

    try {
      const body: any = { targetUrl };
      if (customCode.trim()) {
        body.code = customCode;
      }

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 409) {
        setError('This code already exists. Please choose another.');
      } else if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to create link');
      } else {
        const newLink = await res.json();
        setLinks([newLink, ...links]);
        setTargetUrl('');
        setCustomCode('');
        setSuccess(`Link created: ${newLink.code}`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (code: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete link');

      setLinks(links.filter((link) => link.code !== code));
      setSuccess('Link deleted');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const copyToClipboard = async (code: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const shortUrl = `${baseUrl}/${code}`;
    await navigator.clipboard.writeText(shortUrl);
    setSuccess(`Copied: ${shortUrl}`);
    setTimeout(() => setSuccess(null), 2000);
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    outline: 'none' as const,
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 25%, #16213e 50%, #0f3460 75%, #1e1b4b 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)', animation: 'float 3s ease-in-out infinite' }}>⚡</div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-1px' }}>TinyLink</h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontWeight: '500' }}>Smart URL Shortener</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(34, 197, 94, 0.1)', color: '#86efac', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(34, 197, 94, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86efac', animation: 'pulse 2s ease-in-out infinite' }}></span>Live</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '80px 20px', textAlign: 'center', animation: 'fadeIn 0.8s ease-out', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: '900', marginBottom: '24px', lineHeight: '1.15', letterSpacing: '-2px' }}>
          <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 40%, #f59e0b 70%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', marginBottom: '8px' }}>Turn Long URLs Into</span>
          <span style={{ color: '#e2e8f0' }}>Tiny, Shareable Links</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '16px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>Create short links in seconds, track every click in real-time, and manage your links with beautiful analytics.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✨ <strong>Instant Creation</strong></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📊 <strong>Real-time Analytics</strong></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔐 <strong>Secure & Reliable</strong></span>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '20px 20px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {/* Create Form */}
          <div style={{ animation: 'slideInLeft 0.8s ease-out' }}>
            <div style={{ borderRadius: '20px', padding: '40px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}>🔗</div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#f1f5f9', margin: 0 }}>Create Link</h3>
              </div>

              <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Destination URL</label>
                  <input type='url' value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder='https://example.com/very-long-url' style={inputStyle} disabled={isSubmitting || !dbConnected} onFocus={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Custom Code <span style={{ color: '#64748b', fontWeight: '500', textTransform: 'lowercase' }}>(optional)</span></label>
                  <input type='text' value={customCode} onChange={(e) => setCustomCode(e.target.value)} placeholder='e.g., docs-2024' style={inputStyle} disabled={isSubmitting || !dbConnected} maxLength={8} />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', margin: 0, fontWeight: '500' }}>6-8 alphanumeric characters</p>
                </div>

                {error && <div style={{ padding: '14px 16px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', animation: 'fadeIn 0.3s ease-out', backdropFilter: 'blur(10px)' }}><span style={{ fontSize: '18px', marginTop: '0px', flexShrink: 0 }}>⚠️</span><span>{error}</span></div>}

                {success && <div style={{ padding: '14px 16px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac', animation: 'fadeIn 0.3s ease-out', backdropFilter: 'blur(10px)' }}><span style={{ fontSize: '18px', marginTop: '0px', flexShrink: 0 }}>✅</span><span>{success}</span></div>}

                <button type='submit' disabled={isSubmitting || !targetUrl.trim() || !dbConnected} style={{ width: '100%', marginTop: 'auto', padding: '14px 20px', borderRadius: '12px', fontWeight: '800', color: '#ffffff', border: 'none', cursor: isSubmitting || !targetUrl.trim() || !dbConnected ? 'not-allowed' : 'pointer', opacity: isSubmitting || !targetUrl.trim() || !dbConnected ? 0.5 : 1, background: isSubmitting || !targetUrl.trim() || !dbConnected ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)', boxShadow: '0 15px 40px rgba(99, 102, 241, 0.3)', fontSize: '15px', fontFamily: 'inherit', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textTransform: 'uppercase', letterSpacing: '0.5px' }} onMouseEnter={(e) => !isSubmitting && !dbConnected && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 20px 50px rgba(99, 102, 241, 0.4)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.3)')}>
                  {isSubmitting ? '⏳ Creating...' : '✨ Create Short Link'}
                </button>
              </form>
            </div>
          </div>

          {/* Links Display */}
          <div style={{ animation: 'slideInRight 0.8s ease-out', gridColumn: 'span 1' }}>
            <div style={{ borderRadius: '20px', padding: '40px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 10px 25px rgba(6, 182, 212, 0.3)' }}>📊</div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#f1f5f9', margin: 0 }}>Your Links</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: '600' }}>{filteredLinks.length} active links</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <input type='text' placeholder='Search by code or URL...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputStyle} />
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}><div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div><p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Loading your links...</p></div>
              ) : filteredLinks.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}><p style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</p><p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '14px', fontWeight: '500', lineHeight: '1.6' }}>{links.length === 0 ? (dbConnected ? 'No links yet. Create your first one above!' : 'Database not connected. Configure Neon to create links.') : 'No links match your search'}</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '600px', overflowY: 'auto' }}>
                  {filteredLinks.map((link, index) => (
                    <div key={link.id} style={{ borderRadius: '14px', padding: '18px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(99, 102, 241, 0.15)', animation: `fadeIn 0.5s ease-out ${index * 60}ms both`, transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><code style={{ padding: '6px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.15))', color: '#e0e7ff', fontWeight: 'bold', fontSize: '13px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{link.code}</code><span style={{ color: '#475569', fontWeight: '600' }}>→</span></div>
                        <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>{link.targetUrl}</p>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}><span>📊 {link.clicks} clicks</span><span>⏰ {link.lastClicked ? new Date(link.lastClicked).toLocaleDateString() : 'Never'}</span></div>
                        <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                          <button onClick={() => copyToClipboard(link.code)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '14px', fontWeight: '600', borderBottom: '1px solid rgba(59, 130, 246, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; }} title='Copy link'>📋 Copy</button>
                          <a href={`/code/${link.code}`} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', color: '#86efac', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s ease', fontSize: '14px', fontWeight: '600', borderBottom: '1px solid rgba(34, 197, 94, 0.3)', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34, 197, 94, 0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)'; }} title='View stats'>📈 Stats</a>
                          <button onClick={() => handleDeleteLink(link.code)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '14px', fontWeight: '600', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }} title='Delete link'>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(99, 102, 241, 0.2)', backdropFilter: 'blur(20px)', background: 'rgba(10, 14, 39, 0.7)', marginTop: '80px', padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', position: 'relative', zIndex: 10, boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)' }}>
        <p style={{ margin: 0, fontWeight: '600' }}>Built with ❤️ using Next.js, React & PostgreSQL</p>
        <p style={{ marginTop: '12px', color: '#64748b', margin: 0, fontSize: '12px', fontWeight: '500' }}>© {new Date().getFullYear()} TinyLink. All rights reserved.</p>
      </footer>
    </div>
  );
}
