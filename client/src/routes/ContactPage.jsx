import React, { useEffect, useRef, useState } from 'react';

const RECAPTCHA_SITE_KEY = '6Ld1aDEqAAAAAA3dZAIb2L3i4gRfiIHEVB33LlE2';
const MAX_FILE_SIZE = 8 * 1000 * 1000;

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '$100-$300',
    time: '8-noon',
    textarea: ''
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    function renderWidget() {
      if (recaptchaRef.current && widgetIdRef.current === null && window.grecaptcha?.render) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token) => setCaptchaToken(token),
          'expired-callback': () => setCaptchaToken('')
        });
      }
    }

    if (window.grecaptcha?.render) {
      renderWidget();
    } else {
      window.onRecaptchaApiLoad = renderWidget;
      if (!document.getElementById('recaptcha-script')) {
        const script = document.createElement('script');
        script.id = 'recaptcha-script';
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaApiLoad&render=explicit';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    };
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    setFileError('');
    if (selected && selected.size > MAX_FILE_SIZE) {
      setFileError('Please upload a file less than 8MB');
      e.target.value = '';
      setFile(null);
      return;
    }
    setFile(selected ?? null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!captchaToken) {
      setError('Please complete the reCAPTCHA checkbox');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append('g-recaptcha-response', captchaToken);
    if (file) {
      formData.append('proposal', file);
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error?.message ?? 'Could not send your message');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message ?? 'Could not send your message');
      if (window.grecaptcha?.reset && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
        setCaptchaToken('');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="container text-center" style={{ paddingTop: '10vh' }}>
        <h2>Thank you for reaching out!</h2>
        <p>Someone from our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3vh', paddingBottom: '3vh' }}>
      <h2 className="text-center">Ask Us Anything!</h2>
      <hr />
      {error && <p className="text-danger text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 500 }}>
        <div className="form-group mb-2">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="form-control"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-control"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="budget">Budget Range</label>
          <select
            id="budget"
            className="form-select"
            value={form.budget}
            onChange={(e) => update('budget', e.target.value)}
          >
            <option value="$100-$300">Between $100 to $300</option>
            <option value="$300-$1000">Between $300 to $1000</option>
            <option value="$1000+">More than $1000</option>
          </select>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="time">Availability</label>
          <select
            id="time"
            className="form-select"
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
          >
            <option value="8-noon">Between 8am - 12pm</option>
            <option value="noon-5">Between 12pm to 5pm</option>
            <option value="5-night">After 5pm</option>
          </select>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="textarea">Question or Proposal</label>
          <textarea
            id="textarea"
            className="form-control"
            rows={5}
            value={form.textarea}
            onChange={(e) => update('textarea', e.target.value)}
          />
          <small className="form-text text-muted">
            Please be as detailed as possible so our team can put together a plan for your
            requirements. Your ideas are your own -- we won't share your proposal without written
            permission. Need an NDA first? Email admin@maddoggsoftware.com directly.
          </small>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="proposal">Attach a file (max 8MB)</label>
          <input
            id="proposal"
            type="file"
            accept=".pdf,.docx,.doc"
            className="form-control"
            onChange={handleFileChange}
          />
          {fileError && <small className="text-danger">{fileError}</small>}
        </div>
        <div className="mb-3" ref={recaptchaRef} />
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          Submit
        </button>
        <small className="d-block text-center mt-2">
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </small>
      </form>
    </div>
  );
}
