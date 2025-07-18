import React, { use, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SideNav = ({ isOpen }) => {
  const roleStore = localStorage.getItem('role');
  const [role, setRole] = useState(roleStore);
  const categories = ['Electronics', 'Clothing', 'Books'];
  useEffect(() => {
    console.log(roleStore);
    setRole(roleStore);
  }, [roleStore])

  return (
    <div className={`sidenav ${isOpen ? 'open' : ''}`}>
      <div className="sidenav-inner">
        <h5 className="px-3 pt-3 mb-3">{role === 'admin' ? 'Admin Panel' : 'Categories'}</h5>
        <hr className="my-0" />
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          {role === 'admin' ? (
            <>
              <li className="nav-item"><Link className="nav-link" to="/add-product">Add New Item</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/orders">Order List</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/returned-orders">Returned Orders</Link></li>
            </>
          ) : (
            categories.map((cat, index) => (
              <li className="nav-item" key={index}>
                <Link className="nav-link" to={`/category/${cat.toLowerCase()}`}>{cat}</Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
