import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">EduLearn</Link>
      <div className="nav-links">
        <Link to="/courses">Courses</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {(user.role === 'instructor' || user.role === 'admin') && (
              <Link to="/create-course">Create Course</Link>
            )}
            <span className="nav-user">
              <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              {user.name}
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </span>
            <button className="btn-link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
