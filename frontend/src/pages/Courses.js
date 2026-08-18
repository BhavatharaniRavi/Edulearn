import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

const categories = ['All', 'Web Development', 'Design', 'Business', 'Marketing', 'Data Science'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const trending = ['AI & Machine Learning', 'UI/UX Design', 'No-code Launches'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();

    if (keyword) params.set('keyword', keyword);
    if (category !== 'All') params.set('category', category);
    if (level !== 'All') params.set('level', level);

    return params.toString() ? `?${params.toString()}` : '';
  }, [keyword, category, level]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get(`/courses${buildQuery()}`);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <p className="eyebrow">Find your next learning journey</p>
          <h2>Always stay ahead with curated courses</h2>
          <p>
            Search by topic, skill level, or instructor to discover training
            that fits your career path.
          </p>
        </div>
      </div>

      <div className="trend-bar">
        <span>Trending:</span>

        {trending.map((item) => (
          <span key={item} className="trend-chip">
            {item}
          </span>
        ))}
      </div>

      <form onSubmit={handleSearch} className="filter-bar">
        <input
          type="text"
          placeholder="Search courses..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {levels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-primary">
          Filter
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>
            Try adjusting your search terms and filters to discover more
            classes.
          </p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <Link
              to={`/courses/${course._id}`}
              key={course._id}
              className="course-card glass-card"
            >
              <img
                src={
                  course.thumbnail ||
                  'https://placehold.co/300x180?text=Course'
                }
                alt={course.title}
              />

              <div className="course-card-body">
                <div className="card-top">
                  <span className="badge">{course.level}</span>
                  <span className="badge soft">{course.category}</span>
                </div>

                <h3>{course.title}</h3>

                <p className="muted">
                  By {course.instructor?.name}
                </p>

                <div className="course-meta">
                  <span>
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>

                  <span>
                    {course.averageRating?.toFixed(1) || '0.0'} ⭐
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;