import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';



const Navbar = () => {
  let location = useLocation();
  let navigate = useNavigate();



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    navigate('/login');
  }
  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className='container-fluid'>
        <Link className="navbar-brand" to="/">Noshun</Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current='page' to='/'>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link className={`nav-link ${location.pathname === '/Notes' ? 'active' : ''}`} to='/Notes'>
                Notes
              </Link>
            </li>
          </ul>
          {/* <button className="btn btn-primary" onClick={handleDisplay}>User details</button> */}

          <UserProfile />

          {!localStorage.getItem('token') ? <form className='d-flex' role='search'>

            <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
            <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>

          </form> : <button className="btn btn-primary mx-1" onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
