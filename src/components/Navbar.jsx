import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <span>SPACE ARCHIVE HUB</span>
      </NavLink>
      <ul className="nav-links">
        <li><NavLink to="/" end>Explore</NavLink></li>
        <li><NavLink to="/about">Missions</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
      <button className="nav-profile-btn" onClick={() => navigate('/profile')}>
        Explorer profile &nbsp;↗
      </button>
    </nav>
  )
}
