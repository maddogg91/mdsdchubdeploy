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
    <div className="container text-center" style={{ paddingTop: '10vh' }}>
      {status === 'checking' && <h3>Confirming your payment...</h3>}
      {status === 'success' && <h3>Payment successful!</h3>}
      {status === 'failed' && (
        <>
          <h3>We couldn&apos;t confirm this payment.</h3>
          <p>If you were charged, please contact support.</p>
        </>
      )}
    </div>
  );
}
