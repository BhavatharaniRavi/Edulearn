import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-container glass-card">
      <div className="form-hero">
        <div>
          <p className="eyebrow">Join EduLearn</p>
          <h2>Create your learning dashboard</h2>
          <p>Sign up and start tracking progress, building skills, and sharing knowledge.
          </p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={name}
          onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 6 chars)" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">I want to learn</option>
          <option value="instructor">I want to teach</option>
        </select>
        <button type="submit" className="btn-primary">Create Account</button>
      </form>
      <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
