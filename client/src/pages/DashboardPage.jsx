import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/client.js';
import JobForm from '../components/JobForm.jsx';
import JobList, { STATUSES } from '../components/JobList.jsx';

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/jobs');
      setJobs(data.jobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(
    () => (filter ? jobs.filter((j) => j.status === filter) : jobs),
    [jobs, filter]
  );

  const stats = useMemo(
    () => STATUSES.reduce((acc, status) => {
      acc[status] = jobs.filter((j) => j.status === status).length;
      return acc;
    }, {}),
    [jobs]
  );

  const handleCreate = async (form) => {
    await apiFetch('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setShowForm(false);
    await loadJobs();
  };

  const handleUpdate = async (form) => {
    await apiFetch(`/api/jobs/${editingJob.id}`, {
      method: 'PUT',
      body: JSON.stringify(form),
    });
    setEditingJob(null);
    await loadJobs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await apiFetch(`/api/jobs/${id}`, { method: 'DELETE' });
    await loadJobs();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Your applications</h1>
          <p className="subtitle">Track every role from saved to offer</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { setShowForm(true); setEditingJob(null); }}
        >
          + Add job
        </button>
      </div>

      <div className="stats-row">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={`stat-chip ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(filter === status ? '' : status)}
          >
            <span className={`badge badge-${status}`}>{status}</span>
            <span className="stat-count">{stats[status] ?? 0}</span>
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {(showForm || editingJob) && (
        <div className="panel">
          <h2>{editingJob ? 'Edit job' : 'New job'}</h2>
          <JobForm
            initial={editingJob}
            submitLabel={editingJob ? 'Update job' : 'Add job'}
            onSubmit={editingJob ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingJob(null); }}
          />
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h2>{filter ? `Filtered: ${filter}` : 'All jobs'} ({filteredJobs.length})</h2>
          {filter && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFilter('')}>
              Clear filter
            </button>
          )}
        </div>
        {loading ? (
          <p className="loading">Loading jobs…</p>
        ) : (
          <JobList
            jobs={filteredJobs}
            onEdit={(job) => { setEditingJob(job); setShowForm(false); }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
