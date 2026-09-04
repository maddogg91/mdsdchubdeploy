import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext.jsx';
import { FolderIcon, InboxIcon, LogoutIcon, MenuIcon, UserIcon } from '../icons.jsx';
import './dashboard.css';

const DEFAULT_AVATAR =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

function unreadCount(notifications) {
  return notifications.filter((n) => !n.isRead).length;
}

function navLinkClass({ isActive }) {
  return `sidebar-link${isActive ? ' active' : ''}`;
}

function DashboardChrome() {
  const { logout } = useAuth();
  const { user, notifications, loading } = useDashboard();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const unread = unreadCount(notifications);

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
            src={user?.avatar || DEFAULT_AVATAR}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
            alt=""
          />
          <h5>{user?.name}</h5>
          <p>{user?.usertype}</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard/request" className={navLinkClass}>
            <FolderIcon width={20} height={20} />
            Create a Project
          </NavLink>
          <NavLink to="/dashboard/manage" className={navLinkClass}>
            <FolderIcon width={20} height={20} />
            Manage Projects
          </NavLink>
          <NavLink to="/dashboard/profile" className={navLinkClass}>
            <UserIcon width={20} height={20} />
            Profile
          </NavLink>
          <NavLink to="/dashboard/inbox" className={navLinkClass}>
            <InboxIcon width={20} height={20} />
            Inbox
            {unread > 0 && <span className="sidebar-badge">{unread}</span>}
          </NavLink>
          <button type="button" className="sidebar-link sidebar-link-button" onClick={handleLogout}>
            <LogoutIcon width={20} height={20} />
            Logout
          </button>
        </nav>
      </aside>

      <div className={`dashboard-wrapper${sidebarOpen ? '' : ' fullwidth'}`}>
        <nav className="dashboard-navbar">
          <div className="dashboard-navbar-inner">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <MenuIcon width={22} height={22} />
            </button>
            <NavLink to="/dashboard" className="navbar-brand-text">
              Maddogg Portal
            </NavLink>
            <NavLink to="/dashboard/inbox" className="navbar-inbox-link">
              <InboxIcon width={20} height={20} />
              {unread > 0 && <span className="navbar-badge">{unread}</span>}
            </NavLink>
          </div>
        </nav>

        <div className="dashboard-content">
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
