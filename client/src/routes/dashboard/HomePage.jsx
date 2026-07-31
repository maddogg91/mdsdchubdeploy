import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext.jsx';

function countByType(projects) {
  return projects.reduce(
    (acc, p) => {
      if (p.type === 'website') acc.website++;
      else if (p.type === 'webapp') acc.webapp++;
      else if (p.type === 'mobile') acc.mobile++;
      return acc;
    },
    { website: 0, webapp: 0, mobile: 0 }
  );
}

export default function HomePage() {
  const { projects, error } = useDashboard();
  const counts = useMemo(() => countByType(projects), [projects]);

  return (
    <div>
      <div className="welcome">
        <div className="content rounded-3 p-3">
          <h1 className="fs-3 text-white">Dashboard</h1>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <section className="statistics mt-4">
        <div className="row">
          <div className="col-lg-4">
            <div className="box d-flex rounded-2 align-items-center mb-4 mb-lg-0 p-3">
              <div className="ms-3">
                <div className="d-flex align-items-center">
                  <h3 className="mb-0 text-white">{projects.length}</h3>
                  <span className="d-block ms-2 text-white">Projects</span>
                </div>
                <p className="mb-0">
                  <Link to="/dashboard/manage">Manage Current Projects</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="box d-flex rounded-2 align-items-center mb-4 mb-lg-0 p-3">
              <div className="ms-3">
                <div className="d-flex align-items-center">
                  <h3 className="mb-0 text-white">CREATE</h3>
                  <span className="d-block ms-2 text-white">Request a new project</span>
                </div>
                <p className="mb-0">
                  <Link to="/dashboard/request">Let&apos;s get started</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="statis mt-4 text-center">
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <div className="box bg-primary p-3">
              <h3>{counts.website}</h3>
              <p className="lead">Websites</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <div className="box bg-secondary p-3">
              <h3>{counts.webapp}</h3>
              <p className="lead">Web Apps</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-md-0">
            <div className="box bg-danger p-3">
              <h3>{counts.mobile}</h3>
              <p className="lead">Mobile Apps</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
