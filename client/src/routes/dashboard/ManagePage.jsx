import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext.jsx';
import * as projectsApi from '../../api/projects.js';
import { CodeIcon, LayersIcon, RocketIcon } from '../../components/icons.jsx';

const PACKAGE_LABELS = { 1: 'Basic Package', 2: 'Plus Package', 3: 'Premium Package' };
const TYPE_LABELS = { 1: 'Static', 2: 'Dynamic' };
const STATUS_PERCENT = {
  initiate: 25,
  inprogress: 50,
  review: 75,
  updating: 90,
  complete: 100
};
const TYPE_ICON = {
  website: LayersIcon,
  webapp: CodeIcon,
  mobile: RocketIcon
};

export default function ManagePage() {
  const { projects, refresh, loading } = useDashboard();
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    function onFocus() {
      refresh();
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  async function handlePay(project) {
    setError('');
    setBusyId(project._id);
    try {
      const { checkoutUrl } = await projectsApi.payForProject(project._id);
      window.open(checkoutUrl, '_blank');
    } catch (err) {
      setError(err.message ?? 'Could not start payment');
    } finally {
      setBusyId(null);
    }
  }

  async function handleRequestUpdate(project) {
    const message = window.prompt('Briefly describe what updates you will need below');
    if (!message) return;
    setError('');
    try {
      await projectsApi.requestProjectUpdate(project._id, message);
      window.alert('Request sent! Please allow 24-48 hours for a response.');
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Could not send update request');
    }
  }

  async function handleDelete(project) {
    if (
      !window.confirm(
        'Are you sure you want to delete this project? This does not remove any produced ' +
          'websites but you will no longer be able to track progress or request updates.'
      )
    ) {
      return;
    }
    setError('');
    try {
      await projectsApi.deleteProject(project._id);
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Could not delete project');
    }
  }

  return (
    <div>
      <div className="dash-heading">
        <h1>My Projects</h1>
        <p>Track progress, request updates, and pay outstanding balances.</p>
      </div>

      {error && <p className="auth-alert">{error}</p>}

      {!loading && projects.length === 0 ? (
        <div className="dash-empty">
          <p className="mb-2">No projects found.</p>
          <Link to="/dashboard/request">Create your first project</Link>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((p) => {
            const Icon = TYPE_ICON[p.type] ?? LayersIcon;
            return (
              <div className="project-card" key={p._id}>
                <div className="project-card-icon">
                  <Icon width={22} height={22} />
                </div>
                <h3>{p.request?.businessname}</h3>
                <p className="project-meta">
                  {PACKAGE_LABELS[p.request?.package] ?? p.request?.package} &middot; Domain:{' '}
                  {p.request?.website}
                </p>
                <p className="project-meta">
                  {TYPE_LABELS[p.request?.type] ?? p.request?.type} {p.type}
                </p>
                {p.request?.desc && <p className="project-meta">{p.request.desc}</p>}
                <p className="project-balance">Balance: ${p.balance}</p>
                <p className="project-meta">
                  Lifetime updates remaining: {p.request?.updates} &middot; Requested{' '}
                  {p.creationdate}
                </p>

                <div className="project-progress">
                  <div
                    className="project-progress-bar"
                    style={{ width: `${STATUS_PERCENT[p.status] ?? 0}%` }}
                  />
                </div>
                <div className="project-status-label">{p.status}</div>

                <div className="project-card-actions">
                  <button
                    className="btn-brand-primary btn-brand-sm"
                    disabled={!(p.balance > 0) || busyId === p._id}
                    onClick={() => handlePay(p)}
                  >
                    Pay Now
                  </button>
                  <button
                    className="btn-brand-outline btn-brand-sm"
                    onClick={() => handleRequestUpdate(p)}
                  >
                    Request Update
                  </button>
                  <button className="btn-brand-danger" onClick={() => handleDelete(p)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
