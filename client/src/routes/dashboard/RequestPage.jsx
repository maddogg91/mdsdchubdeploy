import React from 'react';
import { Link } from 'react-router-dom';

const PACKAGES = [
  {
    type: 'website',
    title: 'Websites',
    price: '$150+ tax',
    blurb: 'Static/Dynamic Web served pages',
    detail:
      'Static websites can be delivered fairly quickly and do not require a backend server. ' +
      'Dynamic websites such as sites needing web forms, search forms, etc require a server.'
  },
  {
    type: 'webapp',
    title: 'Web Applications',
    price: '$350+ tax',
    blurb: 'Complex web served applications',
    detail:
      'Web apps are more complex web served applications. Popular examples include ' +
      'login/registration portals requiring database connectivity and live data management.'
  },
  {
    type: 'mobile',
    title: 'Mobile Applications',
    price: '$500+ tax',
    blurb: 'Simple mobile applications',
    detail:
      'Simple Android or iOS apps. Due to the scope of many applications, mobile apps can take ' +
      'the longest for delivery due to testing on multiple platforms.'
  }
];

export default function RequestPage() {
  return (
    <div className="row text-white text-center">
      {PACKAGES.map((pkg) => (
        <div className="col-md-4 mb-4" key={pkg.type}>
          <h1>{pkg.title}</h1>
          <h5>Packages start at {pkg.price}</h5>
          <small>{pkg.blurb}</small>
          <br />
          <Link to={`/dashboard/request/${pkg.type}`}>
            <button className="btn btn-dark my-3">Start {pkg.title} Request</button>
          </Link>
          <h6>{pkg.detail}</h6>
        </div>
      ))}
    </div>
  );
}
