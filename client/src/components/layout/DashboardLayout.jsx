import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext.jsx';
import './dashboard.css';

function unreadCount(notifications) {
  return notifications.filter((n) => !n.isRead).length;
}

function DashboardChrome() {
  const { logout } = useAuth();
  const { user, notifications, loading } = useDashboard();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  if (loading) {
    return null;
  }

  return (
    <div className="dashboard-body">
      <aside className={`dashboard-sidebar${sidebarOpen ? '' : ' hidden'}`}>
        <div className="sidebar-header">
          <img
            src={user?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
            onError={(e) => {
              e.currentTarget.src =
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            }}
            alt=""
          />
          <h5 className="fs-6 mb-0 mt-2">{user?.name}</h5>
          <p className="mt-1 mb-0">{user?.usertype}</p>
        </div>
        <ul>
          <li>
            <button type="button" className="link-like" onClick={() => setProjectsOpen((o) => !o)}>
              Projects
            </button>
            {projectsOpen && (
              <ul className="sidebar-dropdown">
                <li>
                  <Link to="/dashboard/request">Create a project</Link>
                </li>
                <li>
                  <Link to="/dashboard/manage">Manage projects</Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/dashboard/profile">Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/inbox">
              Mailbox {unreadCount(notifications) > 0 && `(${unreadCount(notifications)})`}
            </Link>
          </li>
          <li>
            <button type="button" className="link-like" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </aside>

      <div className={`dashboard-wrapper${sidebarOpen ? '' : ' fullwidth'}`}>
        <nav className="dashboard-navbar navbar navbar-expand-md">
          <div className="container-fluid mx-2">
            <button
              type="button"
              className="navbar-toggler"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <Link className="navbar-brand" to="/dashboard">
              <img className="logo" style={{ width: 40 }} src="/images/MdgLogoAlpha.png" alt="" />
            </Link>
            <ul className="navbar-nav ms-auto flex-row">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/inbox">
                  Inbox
                  {unreadCount(notifications) > 0 && (
                    <span className="notif-badge">{unreadCount(notifications)}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <DashboardChrome />
    </DashboardProvider>
  );
}
