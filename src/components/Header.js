import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <h1> SRK Travles </h1>
        <ul className="menu">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active-link' : 'menu-link'}>
              Daily Update
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'active-link' : 'menu-link'}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => isActive ? 'active-link' : 'menu-link'}>
              Admin
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
