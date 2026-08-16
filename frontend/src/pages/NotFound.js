import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container notfound-page">
    <h2>Page Not Found</h2>
    <p>We couldn't find the page you're looking for. Return to the homepage or browse available courses.</p>
    <Link to="/" className="btn-primary">Back to EduLearn</Link>
  </div>
);

export default NotFound;
