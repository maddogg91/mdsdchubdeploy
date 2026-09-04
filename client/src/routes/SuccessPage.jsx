import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client.js';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const id = searchParams.get('id');
    const sessionId = searchParams.get('session_id');

    if (!id || !sessionId) {
      setStatus('failed');
      return;
    }

    apiFetch(`/checkout/verify?id=${encodeURIComponent(id)}&session_id=${encodeURIComponent(sessionId)}`)
      .then((data) => setStatus(data.verified ? 'success' : 'failed'))
      .catch(() => setStatus('failed'));
  }, [searchParams]);

  return (
    <div className="page-shell">
      <div>
        {status === 'checking' && <h1>Confirming your payment...</h1>}
        {status === 'success' && <h1>Payment successful!</h1>}
        {status === 'failed' && (
          <>
            <h1>We couldn&apos;t confirm this payment</h1>
            <p className="auth-subtitle">If you were charged, please contact support.</p>
          </>
        )}
      </div>
    </div>
  );
}
