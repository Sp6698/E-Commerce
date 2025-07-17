// src/components/SideNav.js
import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = ({ isOpen }) => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];

  return (
    <div className={`sidenav ${isOpen ? 'open' : ''}`}>
      <div className="sidenav-inner">
        <h5 className="px-3 pt-3 mb-3">Categories</h5>
        <hr className="my-0"/>
        <ul className="nav flex-column">
          {categories.map((cat, index) => (
            <li className="nav-item" key={index}>
              <Link className="nav-link" to={`/category/${cat.toLowerCase()}`}>
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
