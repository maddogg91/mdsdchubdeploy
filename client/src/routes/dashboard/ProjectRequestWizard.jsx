import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as projectsApi from '../../api/projects.js';

const BASE_PRICE = { website: 150, webapp: 350, mobile: 500 };
const TITLE = { website: 'Website', webapp: 'Web Application', mobile: 'Mobile Application' };
const PACKAGE_ADDON = { 1: 0, 2: 150, 3: 300 };
const PACKAGE_LABEL = {
  1: 'Basic - landing page + 3 pages',
  2: 'Plus - landing page + 5 pages, 1 free lifetime update',
  3: 'Premium - landing page + 8 pages, 3 free lifetime updates'
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
      <div className="text-white text-center">
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
    <div className="text-white">
      <h2 className="text-center">{TITLE[type]} Request Form</h2>
      <h6 className="text-center">Current Subtotal:</h6>
      <h4 className="text-center">${total}</h4>
      <p className="text-center text-warning">Does not include taxes. This is an estimate.</p>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 500 }}>
        <label>Business Name</label>
        <input
          className="form-control mb-2"
          value={form.businessname}
          onChange={(e) => update('businessname', e.target.value)}
        />

        <label>Industry</label>
        <input
          className="form-control mb-2"
          value={form.industry}
          onChange={(e) => update('industry', e.target.value)}
        />

        <label>How will you use it?</label>
        <select
          className="form-select mb-2"
          value={form.need}
          onChange={(e) => update('need', e.target.value)}
        >
          <option value="marketing">Marketing</option>
          <option value="commerce">E-commerce</option>
          <option value="other">Other</option>
        </select>

        <label>Description</label>
        <textarea
          className="form-control mb-2"
          rows={4}
          value={form.desc}
          onChange={(e) => update('desc', e.target.value)}
        />

        <label>Desired domain / app name</label>
        <input
          className="form-control mb-2"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
        />

        <label>Static or dynamic?</label>
        <select
          className="form-select mb-2"
          value={form.siteType}
          onChange={(e) => update('siteType', e.target.value)}
        >
          <option value="1">Static (+$0)</option>
          <option value="2">Dynamic (+$100)</option>
        </select>

        <label>Package</label>
        <select
          className="form-select mb-2"
          value={form.package}
          onChange={(e) => update('package', e.target.value)}
        >
          <option value="1">Basic (+$0)</option>
          <option value="2">Plus (+$150)</option>
          <option value="3">Premium (+$300)</option>
        </select>
        <small>{PACKAGE_LABEL[form.package]}</small>

        <label className="mt-2">Preferred contact method</label>
        <select
          className="form-select mb-2"
          value={form.contact}
          onChange={(e) => update('contact', e.target.value)}
        >
          <option value="Phone">Phone Call</option>
          <option value="Email">Email</option>
          <option value="Text">Text</option>
        </select>

        <label>Phone number / email</label>
        <input
          className="form-control mb-2"
          value={form.info}
          onChange={(e) => update('info', e.target.value)}
        />

        <label>Additional comments</label>
        <input
          className="form-control mb-3"
          value={form.comment}
          onChange={(e) => update('comment', e.target.value)}
        />

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          Submit
        </button>
      </form>
    </div>
  );
}
