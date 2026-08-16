import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const emptyLesson = { title: '', content: '', videoUrl: '', duration: 0, order: 1 };

const CreateCourse = () => {
  const [step, setStep] = useState(1); // 1 = course details, 2 = lessons
  const [form, setForm] = useState({
    title: '', description: '', category: '', level: 'Beginner', price: 0, thumbnail: '',
  });
  const [createdCourse, setCreatedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const { data } = await api.post('/courses', form);
      setCreatedCourse(data);
      setStep(2);
      setMessage('Course created! Now add a lesson or two to bring it to life.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonForm({
      ...lessonForm,
      [name]: name === 'duration' || name === 'order' ? Number(value) : value,
    });
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const { data } = await api.post(`/courses/${createdCourse._id}/lessons`, lessonForm);
      setLessons((prev) => [...prev, data]);
      setLessonForm(emptyLesson);
      setMessage('Lesson added! Keep going or wrap up whenever you like.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  const stepClass = (n) => `wizard-step ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`;

  return (
    <div className="container wizard-shell">
      <div className="page-header" style={{ paddingTop: '2.5rem' }}>
        <div>
          <p className="eyebrow">Instructor studio</p>
          <h2>Build a course learners will love</h2>
          <p>Fill in the essentials, preview it live, then layer in lessons — all in one flow.</p>
        </div>
      </div>

      <div className="wizard-steps">
        <div className={stepClass(1)}>
          <span className="dot">{step > 1 ? '✓' : '1'}</span> Course details
        </div>
        <div className="wizard-line" />
        <div className={stepClass(2)}>
          <span className="dot">2</span> Lessons
        </div>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="wizard-grid">
        <div className="glass-card wizard-card">
          {step === 1 ? (
            <>
              <h2>Course details</h2>
              <form onSubmit={handleCreateCourse}>
                <input type="text" name="title" placeholder="Course Title" value={form.title}
                  onChange={handleChange} required />
                <textarea name="description" placeholder="Course Description" value={form.description}
                  onChange={handleChange} required />
                <div className="field-row">
                  <input type="text" name="category" placeholder="Category (e.g. Web Development)"
                    value={form.category} onChange={handleChange} required />
                  <select name="level" value={form.level} onChange={handleChange}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="field-row">
                  <input type="number" name="price" placeholder="Price (0 for free)" value={form.price}
                    onChange={handleChange} min="0" />
                  <input type="text" name="thumbnail" placeholder="Thumbnail Image URL (optional)"
                    value={form.thumbnail} onChange={handleChange} />
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Creating…' : 'Create course & continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Add a lesson to "{createdCourse.title}"</h2>
              <form onSubmit={handleAddLesson}>
                <input type="text" name="title" placeholder="Lesson Title" value={lessonForm.title}
                  onChange={handleLessonChange} required />
                <textarea name="content" placeholder="Lesson Content / Notes" value={lessonForm.content}
                  onChange={handleLessonChange} />
                <div className="field-row">
                  <input type="text" name="videoUrl" placeholder="Video URL (optional)"
                    value={lessonForm.videoUrl} onChange={handleLessonChange} />
                  <input type="number" name="duration" placeholder="Duration (minutes)"
                    value={lessonForm.duration} onChange={handleLessonChange} min="0" />
                </div>
                <div className="field-row">
                  <input type="number" name="order" placeholder="Lesson order"
                    value={lessonForm.order} onChange={handleLessonChange} min="1" />
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Adding…' : 'Add lesson'}
                </button>
              </form>

              {lessons.length > 0 && (
                <div className="lesson-mini-list">
                  {lessons.map((l) => (
                    <div className="lesson-mini" key={l._id}>
                      <span>{l.title}</span>
                      <span>{l.duration ? `${l.duration} min` : '—'}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn-secondary" style={{ marginTop: '1.2rem' }}
                onClick={() => navigate('/dashboard')}>
                Finish & go to dashboard
              </button>
            </>
          )}
        </div>

        <div className="preview-card">
          <div
            className="preview-thumb"
            style={form.thumbnail
              ? { backgroundImage: `url(${form.thumbnail})` }
              : { backgroundImage: 'url(https://placehold.co/600x300?text=Course+Image)' }}
          />
          <div className="preview-body">
            <div className="card-top">
              <span className="badge">{form.level}</span>
              {form.category && <span className="badge soft">{form.category}</span>}
            </div>
            {form.title ? <h3>{form.title}</h3> : <h3 className="preview-empty">Your course title appears here</h3>}
            <p className="muted">
              {form.description
                ? `${form.description.slice(0, 110)}${form.description.length > 110 ? '…' : ''}`
                : 'A short, compelling description will show up here as you type.'}
            </p>
            <div className="preview-price">
              {Number(form.price) === 0 ? 'Free' : `$${form.price}`}
            </div>
            {step === 2 && (
              <p className="muted" style={{ marginTop: '0.9rem' }}>
                {lessons.length} lesson{lessons.length === 1 ? '' : 's'} added so far
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
