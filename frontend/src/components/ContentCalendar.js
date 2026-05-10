import React, { useState, useEffect } from 'react';
import { calendarAPI, scriptAPI } from '../api';

const ContentCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    script_id: '',
    platform: 'tiktok',
    status: 'planned',
  });
  const [message, setMessage] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadCalendarEvents();
    loadScripts();
  }, []);

  const loadCalendarEvents = async () => {
    try {
      const response = await calendarAPI.getCalendarEvents();
      setCalendarEvents(response.data);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  };

  const loadScripts = async () => {
    try {
      const response = await scriptAPI.getScripts();
      setScripts(response.data);
    } catch (error) {
      console.error('Error loading scripts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await calendarAPI.addCalendarEvent(formData);
      setMessage('✅ Event added to calendar!');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        topic: '',
        script_id: '',
        platform: 'tiktok',
        status: 'planned',
      });
      loadCalendarEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding event');
      console.error('Error:', error);
    }
  };

  const getMonthDays = (month) => {
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    return { daysInMonth, startDay, year, month: monthNum };
  };

  const { daysInMonth, startDay, year, month } = getMonthDays(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getEventsForDate = (date) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return calendarEvents.filter((event) => event.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="card">
      <h2>📅 Content Calendar</h2>

      {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}

      <div style={{ marginBottom: '30px' }}>
        <h3>Schedule Content</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Topic/Title</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Monday Motivation"
                required
              />
            </div>

            <div className="form-group">
              <label>Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange}>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="planned">Planned</option>
                <option value="scripted">Scripted</option>
                <option value="filmed">Filmed</option>
                <option value="posted">Posted</option>
              </select>
            </div>

            <div className="form-group">
              <label>Script (Optional)</label>
              <select name="script_id" value={formData.script_id} onChange={handleChange}>
                <option value="">No Script</option>
                {scripts.map((script) => (
                  <option key={script.id} value={script.id}>
                    {script.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '20px' }}>
            Add to Calendar
          </button>
        </form>
      </div>

      <div>
        <h3>{monthName}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={prevMonth}>
            ← Previous
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{monthName}</span>
          <button className="btn btn-secondary" onClick={nextMonth}>
            Next →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              style={{
                padding: '10px',
                textAlign: 'center',
                fontWeight: '600',
                background: '#667eea',
                color: 'white',
                borderRadius: '6px',
              }}
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startDay }).map((_, idx) => (
            <div key={`empty-${idx}`} style={{ padding: '10px' }}></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const date = idx + 1;
            const events = getEventsForDate(date);
            return (
              <div
                key={date}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '8px',
                  minHeight: '80px',
                  background: events.length > 0 ? '#f0f7ff' : 'white',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>{date}</div>
                {events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      fontSize: '0.75rem',
                      background: '#667eea',
                      color: 'white',
                      padding: '3px 5px',
                      borderRadius: '3px',
                      marginBottom: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={event.topic}
                  >
                    {event.topic}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3>Scheduled Content</h3>
        {calendarEvents.length === 0 ? (
          <p style={{ color: '#999' }}>No content scheduled. Plan your posts above!</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Script</th>
                </tr>
              </thead>
              <tbody>
                {calendarEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.topic}</td>
                    <td>{event.platform}</td>
                    <td>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#e0e0e0', fontSize: '0.85rem' }}>
                        {event.status}
                      </span>
                    </td>
                    <td>{event.script_title || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCalendar;
