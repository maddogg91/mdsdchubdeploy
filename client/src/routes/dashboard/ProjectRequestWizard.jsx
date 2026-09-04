import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as projectsApi from '../../api/projects.js';

const BASE_PRICE = { website: 150, webapp: 350, mobile: 500 };
const TITLE = { website: 'Website', webapp: 'Web Application', mobile: 'Mobile Application' };
const PACKAGE_ADDON = { 1: 0, 2: 150, 3: 300 };
const PACKAGE_LABEL = {
  1: 'Basic -- landing page + 3 pages',
  2: 'Plus -- landing page + 5 pages, 1 free lifetime update',
  3: 'Premium -- landing page + 8 pages, 3 free lifetime updates'
};

export default function ProjectRequestWizard() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    businessname: '',
    industry: '',
    need: 'marketing',
    desc: '',
    website: '',
    siteType: '1',
    package: '1',
    contact: 'Email',
    info: '',
    comment: ''
  });

  const basePrice = BASE_PRICE[type] ?? 150;
  const total = useMemo(() => {
    const siteTypeAddon = form.siteType === '2' ? 100 : 0;
    const packageAddon = PACKAGE_ADDON[form.package] ?? 0;
    return basePrice + siteTypeAddon + packageAddon;
  }, [basePrice, form.siteType, form.package]);

  if (!TITLE[type]) {
    return (
      <div className="dash-empty">
        <p>Unknown project type.</p>
      </div>
    );
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.businessname || !form.website) {
      setError('Business name and website/app name are required');
      return;
    }
    setSubmitting(true);
    try {
      await projectsApi.createProject(type, { ...form, type: form.siteType, total });
      navigate('/dashboard/manage');
    } catch (err) {
      setError(err.message ?? 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="dash-heading">
        <h1>{TITLE[type]} Request</h1>
        <p>Tell us about the project -- we&apos;ll follow up with a full quote.</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="d-flex justify-content-between align-items-baseline mb-3">
          <span className="dash-card-label">Estimated subtotal</span>
          <span className="stat-value" style={{ fontSize: '1.5rem' }}>
            ${total}
          </span>
        </div>
        <p className="project-meta mb-3">Estimate only, excludes tax. We&apos;ll confirm the final quote with you.</p>

        {error && <p className="auth-alert">{error}</p>}

        <label htmlFor="businessname">Business name</label>
        <input
          id="businessname"
          value={form.businessname}
          onChange={(e) => update('businessname', e.target.value)}
        />

        <label htmlFor="industry">Industry</label>
        <input
          id="industry"
          value={form.industry}
          onChange={(e) => update('industry', e.target.value)}
        />

        <label htmlFor="need">How will you use it?</label>
        <select id="need" value={form.need} onChange={(e) => update('need', e.target.value)}>
          <option value="marketing">Marketing</option>
          <option value="commerce">E-commerce</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="desc">Description</label>
        <textarea
          id="desc"
          rows={4}
          value={form.desc}
          onChange={(e) => update('desc', e.target.value)}
        />

        <label htmlFor="website">Desired domain / app name</label>
        <input
          id="website"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />

        <label htmlFor="siteType">Static or dynamic?</label>
        <select
          id="siteType"
          value={form.siteType}
          onChange={(e) => update('siteType', e.target.value)}
        >
          <option value="1">Static (+$0)</option>
          <option value="2">Dynamic (+$100)</option>
        </select>

        <label htmlFor="package">Package</label>
        <select id="package" value={form.package} onChange={(e) => update('package', e.target.value)}>
          <option value="1">Basic (+$0)</option>
          <option value="2">Plus (+$150)</option>
          <option value="3">Premium (+$300)</option>
        </select>
        <p className="project-meta mb-3">{PACKAGE_LABEL[form.package]}</p>

        <label htmlFor="contact">Preferred contact method</label>
        <select id="contact" value={form.contact} onChange={(e) => update('contact', e.target.value)}>
          <option value="Phone">Phone Call</option>
          <option value="Email">Email</option>
          <option value="Text">Text</option>
        </select>

        <label htmlFor="info">Phone number / email</label>
        <input id="info" value={form.info} onChange={(e) => update('info', e.target.value)} />

        <label htmlFor="comment">Additional comments</label>
        <input id="comment" value={form.comment} onChange={(e) => update('comment', e.target.value)} />

        <button type="submit" className="btn-brand-primary w-100 mt-2" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
