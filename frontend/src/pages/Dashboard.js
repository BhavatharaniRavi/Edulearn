import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        if (user.role === 'student') {
          const { data } = await api.get('/enrollments/my');
          setEnrollments(data);
        } else {
          const { data } = await api.get('/courses/instructor/mine');
          setMyCourses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user || loading) return <Loader />;

  return (
    <div className="container">
      <div className="page-header dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Welcome back, {user.name}</h2>
          <p>{user.role === 'student'
            ? 'Keep learning with your latest courses and track your progress.'
            : 'Manage your curriculum, publish lessons, and inspire new students.'}
          </p>
        </div>
        {user.role !== 'student' && (
          <Link to="/create-course" className="btn-primary">Create course</Link>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card gradient-card">
          <span>Active Path</span>
          <strong>{user.role === 'student' ? enrollments.length : myCourses.length}</strong>
        </div>
        <div className="stat-card gradient-card soft">
          <span>{user.role === 'student' ? 'Average Progress' : 'Published Courses'}</span>
          <strong>{user.role === 'student' ? `${Math.round(enrollments.reduce((sum, en) => sum + en.progress, 0) / Math.max(enrollments.length, 1))}%` : myCourses.length}</strong>
        </div>
        <div className="stat-card gradient-card">
          <span>{user.role === 'student' ? 'Highlights' : 'New Opportunities'}</span>
          <strong>{user.role === 'student' ? 'Stay focused' : 'Grow your reach'}</strong>
        </div>
      </div>

      {user.role === 'student' ? (
        <>
          <h3>Continue learning</h3>
          {enrollments.length === 0 ? (
            <div className="empty-state">
              <h3>No active courses yet</h3>
              <p>Discover classes designed to help you grow professionally.</p>
              <Link to="/courses" className="btn-secondary">Browse Courses</Link>
            </div>
          ) : (
            <div className="course-grid">
              {enrollments.map((en) => (
                <Link to={`/courses/${en.course?._id}`} key={en._id} className="course-card glass-card">
                  <img
                    src={en.course?.thumbnail || 'https://placehold.co/300x180?text=Course'}
                    alt={en.course?.title}
                  />
                  <div className="course-card-body">
                    <div className="card-top">
                      <span className="badge soft">In progress</span>
                    </div>
                    <h3>{en.course?.title}</h3>
                    <p className="muted">By {en.course?.instructor?.name}</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${en.progress}%` }} />
                    </div>
                    <p className="muted">{en.progress}% complete</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h3>Your courses</h3>
          {myCourses.length === 0 ? (
            <div className="empty-state">
              <h3>No courses created yet</h3>
              <p>Begin building your first course to connect with motivated learners.</p>
            </div>
          ) : (
            <div className="course-grid">
              {myCourses.map((course) => (
                <Link to={`/courses/${course._id}`} key={course._id} className="course-card glass-card">
                  <img
                    src={course.thumbnail || 'https://placehold.co/300x180?text=Course'}
                    alt={course.title}
                  />
                  <div className="course-card-body">
                    <div className="card-top">
                      <span className="badge">{course.studentsEnrolled} students</span>
                    </div>
                    <h3>{course.title}</h3>
                    <p className="muted">{course.lessons?.length || 0} lessons</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
