import { Link } from 'react-router-dom';

const categories = ['Web Development', 'Design', 'Business', 'Marketing', 'Data Science'];

const Home = () => {
  return (
    <>
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Online learning reimagined</p>
          <h1>Grow your skills with premium, career-ready courses</h1>
          <p>Jump into hands-on classes led by top instructors, build real-world projects, and level up your career at your own pace.</p>
          <div className="hero-actions">
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
            <Link to="/register" className="btn-secondary">Create account</Link>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <strong>28K+</strong>
              <span>Active learners</span>
            </div>
            <div className="stat-card">
              <strong>320+</strong>
              <span>Expert-led courses</span>
            </div>
            <div className="stat-card">
              <strong>4.9 ⭐</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-top">Featured paths</div>
          <div className="panel-card highlight">
            <span>Build an AI portfolio</span>
            <strong>12 lessons</strong>
          </div>
          <div className="panel-card soft">
            <span>Design systems mastery</span>
            <strong>8 lessons</strong>
          </div>
          <div className="panel-card soft">
            <span>Startup marketing essentials</span>
            <strong>10 lessons</strong>
          </div>
        </div>
      </div>

      <div className="container home-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Explore by category</p>
            <h2>Discover the right track for your goals</h2>
          </div>
        </div>
        <div className="chip-list">
          {categories.map((item) => (
            <span key={item} className="chip">{item}</span>
          ))}
        </div>
      </div>

      <div className="container home-section">
        <div className="feature-grid">
          <div className="feature-card large">
            <h3>Launch your teaching career</h3>
            <p>Instructors can publish courses, manage lessons, and engage learners with ease.</p>
          </div>
          <div className="feature-card soft">
            <h4>Interactive progress tracker</h4>
            <p>Students see progress bars, lesson completion, and clear learning milestones.</p>
          </div>
          <div className="feature-card soft">
            <h4>Community-driven growth</h4>
            <p>Earn ratings, collect feedback, and become a trusted educator on the platform.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
