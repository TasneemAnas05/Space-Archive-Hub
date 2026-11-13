import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <span className="brand-icon">🚀</span>
        <span>SPACE MISSIONS</span>
      </NavLink>
      <ul className="nav-links">
        <li><NavLink to="/"      end>Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/games">Games</NavLink></li>
      </ul>
    </nav>
  )
}
