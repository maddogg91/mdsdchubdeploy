import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
  return (
    <nav className="site-navbar navbar navbar-expand-lg navbar-light">
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
          </ul>
          <Link to="/contact">
            <button type="button" className="btn btn-nav-cta">
              Schedule A Consultation Call
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
