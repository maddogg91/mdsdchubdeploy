import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import * as profileApi from '../../api/profile.js';

const DEFAULT_AVATAR =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

export default function ProfilePage() {
  const { user, projects, refresh } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const projectCounts = projects.reduce(
    (acc, p) => {
      if (p.type === 'website') acc.website++;
      else if (p.type === 'webapp') acc.webapp++;
      else if (p.type === 'mobile') acc.mobile++;
      return acc;
    },
    { website: 0, webapp: 0, mobile: 0 }
  );

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (avatarFile) {
        await profileApi.uploadAvatar(avatarFile);
      }
      await profileApi.updateProfile({
        name,
        email,
        phone,
        passw: password || undefined,
        passwordFlag: Boolean(password)
      });
      setPassword('');
      setEditing(false);
      await refresh();
    } catch (err) {
      setError(err.message ?? 'Could not update profile');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="dash-heading">
        <h1>Profile</h1>
        <p>Your account details and project totals.</p>
      </div>

      <div className="profile-header">
        <img
          className="profile-avatar"
          src={avatarPreview || user.avatar || DEFAULT_AVATAR}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
          alt=""
        />
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p>
            {user.usertype}
            {user.joindate && ` -- member since ${new Date(user.joindate).toLocaleDateString()}`}
          </p>
        </div>
        <div className="profile-stats">
          <div>
            <div className="stat-value">{projectCounts.website}</div>
            <div className="stat-label">Sites</div>
          </div>
          <div>
            <div className="stat-value">{projectCounts.webapp}</div>
            <div className="stat-label">Web Apps</div>
          </div>
          <div>
            <div className="stat-value">{projectCounts.mobile}</div>
            <div className="stat-label">Mobile</div>
          </div>
        </div>
      </div>

      {!editing && (
        <button type="button" className="btn-brand-primary" onClick={() => setEditing(true)}>
          Edit Profile
        </button>
      )}

      {editing && (
        <form className="profile-form" onSubmit={handleSubmit}>
          <h3>Edit Profile</h3>
          {error && <p className="auth-alert">{error}</p>}
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <label htmlFor="avatar">Profile photo</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ marginBottom: '1.25rem' }}
          />
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn-brand-outline w-100"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-brand-primary w-100" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
