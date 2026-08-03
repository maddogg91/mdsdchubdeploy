import React from 'react';
import { Link } from 'react-router-dom';
import {
  StorefrontIcon,
  CameraIcon,
  RocketIcon,
  CodeIcon,
  LayersIcon,
  CompassIcon
} from '../components/icons.jsx';
import './marketing.css';

const AUDIENCES = [
  {
    Icon: StorefrontIcon,
    title: 'Small Business Owners',
    body: 'Replace spreadsheets and off-the-shelf templates with a website and internal tools built around how you actually run your business.'
  },
  {
    Icon: CameraIcon,
    title: 'Social Media Influencers & Creators',
    body: 'A media kit site, booking flow, or storefront that matches your brand -- so your audience has one place to find everything you offer.'
  },
  {
    Icon: RocketIcon,
    title: 'Entrepreneurs & Startups',
    body: 'Turn an idea into a working product. We help you scope, build, and ship a first version without overbuilding before you have customers.'
  }
];

const SERVICES = [
  {
    Icon: CodeIcon,
    title: 'Custom Software Development',
    body: 'Purpose-built applications and internal tools designed around your workflow, not a generic template.'
  },
  {
    Icon: LayersIcon,
    title: 'Websites & Web Apps',
    body: 'Fast, modern, mobile-friendly sites and web applications -- from a landing page to a full customer portal.'
  },
  {
    Icon: CompassIcon,
    title: 'Strategic Consulting',
    body: 'Not sure where to start? We help you plan the right scope, stack, and roadmap before writing a single line of code.'
  }
];

export default function MarketingHomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow hero-glow-1" aria-hidden="true" />
        <div className="hero-glow hero-glow-2" aria-hidden="true" />
        <div className="container hero-content">
          <span className="eyebrow">Custom Software &amp; Strategic Consulting</span>
          <h1>Software built around how your business actually works.</h1>
          <p className="lead">
            We design and build custom websites, applications, and digital tools for small
            business owners, social media influencers, and entrepreneurs ready to move past
            templates and spreadsheets.
          </p>
          <div className="hero-actions">
            <Link to="/contact">
              <button type="button" className="btn btn-hero-primary">
                Schedule a Free Consultation
              </button>
            </Link>
            <Link to="/register">
              <button type="button" className="btn btn-hero-secondary">
                Create an Account
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section audience-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow eyebrow-dark">Who we build for</span>
            <h2>Software for people building something of their own</h2>
          </div>
          <div className="card-grid">
            {AUDIENCES.map(({ Icon, title, body }) => (
              <div className="feature-card" key={title}>
                <div className="feature-icon">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow eyebrow-dark">What we do</span>
            <h2>From a first idea to a finished product</h2>
          </div>
          <div className="card-grid">
            {SERVICES.map(({ Icon, title, body }) => (
              <div className="feature-card feature-card-alt" key={title}>
                <div className="feature-icon feature-icon-alt">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container text-center">
          <h2>Ready to build something great?</h2>
          <p>Tell us about your business and let&apos;s talk through what a custom solution could look like.</p>
          <Link to="/contact">
            <button type="button" className="btn btn-hero-primary">
              Schedule A Consultation Call
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
