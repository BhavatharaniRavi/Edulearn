import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCourse = async () => {
    const { data } = await api.get(`/courses/${id}`);
    setCourse(data);
  };

  const checkEnrollment = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/enrollments/my');
      setEnrolled(data.some((e) => e.course?._id === id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      await api.post(`/enrollments/${id}`);
      setEnrolled(true);
      setMessage('🎉 You are now enrolled! Keep your momentum going.');
      fetchCourse();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${id}/reviews`, { rating, comment });
      setComment('');
      setMessage('Thanks! Your review helps future learners.');
      fetchCourse();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!course) return <div className="container">Loading course...</div>;

  return (
    <div className="container">
      <div className="course-header">
        <img
          src={course.thumbnail || 'https://placehold.co/600x300?text=Course'}
          alt={course.title}
        />
        <div className="course-sidebar">
          <div className="course-pill-group">
            <span className="badge">{course.level}</span>
            <span className="badge soft">{course.category}</span>
          </div>
          <h2>{course.title}</h2>
          <p className="muted">By {course.instructor?.name}</p>
          <p className="course-desc">{course.description}</p>

          <div className="course-metrics">
            <div>
              <strong>{course.studentsEnrolled}</strong>
              <span>Enrolled</span>
            </div>
            <div>
              <strong>{course.reviews?.length || 0}</strong>
              <span>Reviews</span>
            </div>
            <div>
              <strong>{course.averageRating?.toFixed(1) || '0.0'}</strong>
              <span>Rating</span>
            </div>
          </div>

          <div className="hero-actions course-actions">
            {user && user.role === 'student' ? (
              enrolled ? (
                <button className="btn-secondary">Already Enrolled</button>
              ) : (
                <button className="btn-primary" onClick={handleEnroll}>Enroll Now</button>
              )
            ) : (
              <p className="muted">Log in as a student to enroll.</p>
            )}
            <div className="price-tag">{course.price === 0 ? 'Free' : `$${course.price}`}</div>
          </div>

          {message && <p className="info">{message}</p>}
        </div>
      </div>

      <div className="tab-list">
        {['overview', 'lessons', 'reviews'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="glass-card course-overview">
          <h3>Course Overview</h3>
          <p>{course.description}</p>
          <ul className="feature-list">
            <li>Structured lessons with clear outcomes</li>
            <li>Real examples and hands-on practice</li>
            <li>High-quality instructor feedback</li>
          </ul>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="glass-card">
          <h3>Lesson roadmap</h3>
          {course.lessons?.length === 0 ? (
            <p>No lessons added yet.</p>
          ) : (
            <ol className="lesson-list">
              {course.lessons.map((lesson) => (
                <li key={lesson._id}>
                  <strong>{lesson.order ? `${lesson.order}. ` : ''}{lesson.title}</strong>
                  <p className="muted">
                    {lesson.duration ? `${lesson.duration} min` : 'No duration'}
                    {lesson.content ? ` • ${lesson.content.slice(0, 70)}...` : ''}
                  </p>
                  {lesson.videoUrl && (
                    <p className="muted">Video: {lesson.videoUrl}</p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="glass-card">
          <h3>Community Feedback</h3>
          {course.reviews?.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <div className="review-grid">
              {course.reviews.map((r, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <strong>{r.user?.name || 'Anonymous'}</strong>
                    <span>{r.rating}⭐</span>
                  </div>
                  <p>{r.comment || 'Great course with insightful lessons.'}</p>
                </div>
              ))}
            </div>
          )}

          {user && enrolled && (
            <form onSubmit={handleReview} className="review-form">
              <h4>Leave a Review</h4>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <textarea
                placeholder="Share your experience"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
