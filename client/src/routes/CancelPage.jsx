import React, { useEffect } from 'react';

export default function CancelPage() {
  useEffect(() => {
    const timer = setTimeout(() => window.close(), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-shell">
      <div>
        <h1>Payment cancelled</h1>
        <p className="auth-subtitle">This page will close automatically.</p>
      </div>
    </div>
  );
}
