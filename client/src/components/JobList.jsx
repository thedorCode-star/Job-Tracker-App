import { STATUSES } from './JobForm.jsx';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function JobList({ jobs, onEdit, onDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <p>No jobs yet. Add your first application above.</p>
      </div>
    );
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <article key={job.id} className="job-card">
          <div className="job-card-header">
            <div>
              <h3>{job.title}</h3>
              <p className="job-company">{job.company}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
          <div className="job-meta">
            {job.location && <span>{job.location}</span>}
            {job.applied_date && <span>Applied: {job.applied_date}</span>}
          </div>
          {job.notes && <p className="job-notes">{job.notes}</p>}
          {job.job_url && (
            <a href={job.job_url} target="_blank" rel="noreferrer" className="job-link">
              View posting →
            </a>
          )}
          <div className="job-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(job)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(job.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export { STATUSES };
