import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-14 col-md-4">
            <h6>About</h6>
            <p className="text-justify">
              *Maddogg Software Development Ltd Co. is a black owned, veteran-owned, software
              development company located in Ellenwood GA (Metro Atlanta)
            </p>
          </div>
          <div className="col-xs-4 col-md-3">
            <h6>Quick Links</h6>
            <ul className="footer-links">
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/terms">Terms</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">
              Copyright &copy; {new Date().getFullYear()} All Rights Reserved by{' '}
              <Link style={{ color: '#ff8a5b' }} to="/">
                Maddogg Software Development Ltd Co.
              </Link>
              .{' '}
              <a style={{ color: 'white' }} href="https://maddoggsoftware.com">
                Powered By Maddogg Software
              </a>
              <br />
              <small>
                Some images used may come from open-sourced stock photos. If photos used require
                annotation contact Robert Charity II at robertcharityii@gmail.com
              </small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
