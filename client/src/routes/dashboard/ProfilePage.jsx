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
      <h1 className="text-white">
        <button type="button" className="btn btn-primary me-2" onClick={() => setEditing((v) => !v)}>
          {editing ? 'Close' : 'Edit'}
        </button>
        User Profile
      </h1>

      <div className="user-profile text-center">
        <img
          className="rounded-circle"
          style={{ width: 120, height: 120, objectFit: 'cover' }}
          src={avatarPreview || user.avatar || DEFAULT_AVATAR}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
          alt=""
        />
        <div className="username text-white fs-4 mt-2">{user.name}</div>
        <div className="bio text-white">
          Email: {user.email}
          <br />
          Phone: {user.phone}
        </div>
        <div className="description text-white">
          {user.usertype}
          <br />
          {user.joindate && <>Member since {new Date(user.joindate).toLocaleDateString()}</>}
        </div>
        <ul className="data list-unstyled text-white">
          <li>Sites: {projectCounts.website}</li>
          <li>Web Apps: {projectCounts.webapp}</li>
          <li>Mobile Apps: {projectCounts.mobile}</li>
        </ul>
      </div>

      {editing && (
        <form className="form-container mx-auto" style={{ maxWidth: 400 }} onSubmit={handleSubmit}>
          <h4>Edit Profile</h4>
          {error && <p className="text-danger">{error}</p>}
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="form-control mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-control mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            className="form-control mb-2"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="text"
            className="form-control mb-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor="avatar">Profile photo</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={handleAvatarChange}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            Update
          </button>
        </form>
      )}
    </div>
  );
}
