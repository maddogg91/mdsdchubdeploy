import React from 'react';
import { Link } from 'react-router-dom';
import { CodeIcon, LayersIcon, RocketIcon } from '../../components/icons.jsx';

const PACKAGES = [
  {
    type: 'website',
    Icon: LayersIcon,
    title: 'Websites',
    price: 'From $150+ tax',
    blurb: 'Static or dynamic web pages',
    detail:
      'Static websites can be delivered fairly quickly and do not require a backend server. Dynamic sites needing forms or search require a server.'
  },
  {
    type: 'webapp',
    Icon: CodeIcon,
    title: 'Web Applications',
    price: 'From $350+ tax',
    blurb: 'Complex, database-backed applications',
    detail:
      'Popular examples include login/registration portals requiring database connectivity and live data management.'
  },
  {
    type: 'mobile',
    Icon: RocketIcon,
    title: 'Mobile Applications',
    price: 'From $500+ tax',
    blurb: 'Simple Android or iOS apps',
    detail:
      'Due to the scope of many applications, mobile apps can take the longest for delivery because of testing across multiple platforms.'
  }
];

export default function RequestPage() {
  return (
    <div>
      <div className="dash-heading">
        <h1>Start a new project</h1>
        <p>Pick the type of project you&apos;d like to request.</p>
      </div>

      <div className="dash-grid">
        {PACKAGES.map(({ type, Icon, title, price, blurb, detail }) => (
          <div className="dash-card" key={type}>
            <div className="dash-card-icon accent mb-3">
              <Icon />
            </div>
            <h3 className="dash-card-title" style={{ fontSize: '1.2rem' }}>
              {title}
            </h3>
            <p className="dash-card-label mb-1">{price}</p>
            <p className="dash-card-label mb-3">{blurb}</p>
            <p className="project-meta">{detail}</p>
            <Link to={`/dashboard/request/${type}`}>
              <button type="button" className="btn-brand-primary mt-2">
                Start {title} Request
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
