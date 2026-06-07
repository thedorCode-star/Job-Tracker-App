import { useState } from 'react';

const STATUSES = ['saved', 'applied', 'interview', 'rejected', 'offer'];

const EMPTY_FORM = {
  title: '',
  company: '',
  location: '',
  job_url: '',
  status: 'saved',
  notes: '',
  applied_date: '',
};

export default function JobForm({ initial, onSubmit, onCancel, submitLabel = 'Save job' }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-grid">
        <label>
          Title *
          <input name="title" value={form.title} onChange={handleChange} required placeholder="Software Engineer" />
        </label>
        <label>
          Company *
          <input name="company" value={form.company} onChange={handleChange} required placeholder="Acme Corp" />
        </label>
        <label>
          Location
          <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Remote" />
        </label>
        <label>
          Status
          <select name="status" value={form.status || 'saved'} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="span-2">
          Job URL
          <input name="job_url" type="url" value={form.job_url || ''} onChange={handleChange} placeholder="https://..." />
        </label>
        <label>
          Applied date
          <input name="applied_date" type="date" value={form.applied_date || ''} onChange={handleChange} />
        </label>
        <label className="span-2">
          Notes
          <textarea name="notes" rows={3} value={form.notes || ''} onChange={handleChange} placeholder="Referral, recruiter name, etc." />
        </label>
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export { STATUSES };
