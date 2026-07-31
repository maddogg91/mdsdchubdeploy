import React, { useEffect } from 'react';

export default function CancelPage() {
  useEffect(() => {
    const timer = setTimeout(() => window.close(), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container text-center" style={{ paddingTop: '10vh' }}>
      <h3>Operation Cancelled</h3>
      <p>This page will automatically close.</p>
    </div>
  );
}
