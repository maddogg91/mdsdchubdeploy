import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { FolderIcon, RocketIcon } from '../../components/icons.jsx';

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
  const { user, projects, error } = useDashboard();
  const counts = useMemo(() => countByType(projects), [projects]);

  return (
    <div>
      <div className="dash-heading">
        <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
        <p>Here&apos;s a snapshot of your projects.</p>
      </div>

      {error && <p className="auth-alert">{error}</p>}

      <div className="dash-grid mb-4">
        <Link to="/dashboard/manage" className="dash-card dash-card-link">
          <div className="dash-card-icon">
            <FolderIcon />
          </div>
          <div>
            <p className="dash-card-title">{projects.length}</p>
            <p className="dash-card-label">Manage current projects</p>
          </div>
        </Link>
        <Link to="/dashboard/request" className="dash-card dash-card-link">
          <div className="dash-card-icon accent">
            <RocketIcon />
          </div>
          <div>
            <p className="dash-card-title">Create</p>
            <p className="dash-card-label">Request a new project</p>
          </div>
        </Link>
      </div>

      <div className="dash-grid">
        <div className="stat-card">
          <div className="stat-value">{counts.website}</div>
          <div className="stat-label">Websites</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{counts.webapp}</div>
          <div className="stat-label">Web Apps</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{counts.mobile}</div>
          <div className="stat-label">Mobile Apps</div>
        </div>
      </div>
    </div>
  );
}
