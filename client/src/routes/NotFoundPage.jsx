import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container text-center" style={{ paddingTop: '10vh' }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/login">Back to login</Link>
    </div>
  );
}
