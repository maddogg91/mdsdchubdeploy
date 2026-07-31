import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ backgroundColor: 'silver' }}>
      <div className="container-fluid">
        <Link to="/">
          <img className="navbar-brand" src="/images/toplogo.png" alt="Maddogg Software" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Get Started
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contractor">
                Contractor Portal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/terms">
                Terms
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cookies">
                Cookies Policy
              </Link>
            </li>
          </ul>
          <Link to="/contact">
            <button type="button" className="btn btn-sm btn-outline-dark">
              Schedule A Consultation Call Today
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
