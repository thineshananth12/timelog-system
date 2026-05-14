import { useState } from 'react';
import api from '../api/client';

export default function LeaveForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  function validateForm() {

    const newErrors = {};

    // ─── Start Date ─────────────────────────

    if (!startDate) {

      newErrors.start_date =
        'Start date is required';
    }

    // ─── End Date ───────────────────────────

    if (!endDate) {

      newErrors.end_date =
        'End date is required';
    }

    // ─── Date Comparison ────────────────────

    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {

      newErrors.end_date =
        'End date must be after start date';
    }

    // ─── Reason ─────────────────────────────

    if (!reason.trim()) {

      newErrors.reason =
        'Reason is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors)
      .length === 0;
  }
  async function submitLeave(e) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await api.post('/leaves', {
        start_date: startDate,
        end_date: endDate,
        reason,
      });

      alert('Leave applied successfully');

      // ─── Reset Form ───────────────────────
      setStartDate('');
      setEndDate('');
      setReason('');
      setErrors({});
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="card">
      <h2>Apply Leave</h2>

      {/* <form onSubmit={submitLeave}>
        <div className="form-group">
          <label>Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason</label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button type="submit">
          Apply Leave
        </button>
      </form> */}
      <form onSubmit={submitLeave}>

        {/* Start Date */}

        <div className="form-group">

          <label>
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => {

              setStartDate(
                e.target.value
              );

              setErrors((prev) => ({
                ...prev,
                start_date: '',
              }));
            }}
          />

          {errors.start_date && (

            <p className="error-text">
              {errors.start_date}
            </p>

          )}

        </div>

        {/* End Date */}

        <div className="form-group">

          <label>
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => {

              setEndDate(
                e.target.value
              );

              setErrors((prev) => ({
                ...prev,
                end_date: '',
              }));
            }}
          />

          {errors.end_date && (

            <p className="error-text">
              {errors.end_date}
            </p>

          )}

        </div>

        {/* Reason */}

        <div className="form-group">

          <label>
            Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => {

              setReason(
                e.target.value
              );

              setErrors((prev) => ({
                ...prev,
                reason: '',
              }));
            }}
          />

          {errors.reason && (

            <p className="error-text">
              {errors.reason}
            </p>

          )}

        </div>

        <button type="submit">
          Apply Leave
        </button>

      </form>
    </div>
  );
}