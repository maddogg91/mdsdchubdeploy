import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import * as projectsApi from '../../api/projects.js';

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
  website: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
  webapp: 'https://icon-library.com/images/web-application-icon/web-application-icon-13.jpg',
  mobile: 'https://cdn-icons-png.flaticon.com/512/5608/5608615.png'
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

  if (!loading && projects.length === 0) {
    return (
      <div className="text-center text-white">
        <p>No projects found.</p>
        <a href="/dashboard/request">Create your first project</a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-white">My Projects</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="row row-cols-1 row-cols-md-auto">
        {projects.map((p) => (
          <div className="col mb-4" key={p._id}>
            <div className="card p-3">
              <img src={TYPE_ICON[p.type]} style={{ width: 60, height: 60 }} alt="" />
              <h3>{p.request?.businessname}</h3>
              <h4>Package: {PACKAGE_LABELS[p.request?.package] ?? p.request?.package}</h4>
              <p>
                <b>Project Details:</b>
                <br />
                Domain: {p.request?.website}
                <br />
                Project Type: {p.type}
                <br />
                <small>
                  <b>Description:</b> {p.request?.desc}
                </small>
                <br />
                <small>Site Type: {TYPE_LABELS[p.request?.type] ?? p.request?.type}</small>
              </p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>Project Balance: ${p.balance}</p>
              <button
                className="btn btn-primary btn-sm mb-1"
                disabled={!(p.balance > 0) || busyId === p._id}
                onClick={() => handlePay(p)}
              >
                Pay Now
              </button>{' '}
              <button className="btn btn-light btn-sm mb-1" onClick={() => handleRequestUpdate(p)}>
                Request An Update
              </button>
              <br />
              <small style={{ color: 'blue', fontWeight: 'bold' }}>
                Lifetime Updates: {p.request?.updates}
              </small>
              <br />
              <small>Request Date: {p.creationdate}</small>
              <div className="progress mt-2" style={{ height: 20 }}>
                <div
                  className="progress-bar"
                  style={{ width: `${STATUS_PERCENT[p.status] ?? 0}%` }}
                >
                  {p.status}
                </div>
              </div>
              <button className="btn btn-light btn-sm mt-2" onClick={() => handleDelete(p)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
