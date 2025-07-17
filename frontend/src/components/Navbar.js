// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidenav, sidenavOpen }) => {
    return (
        <nav className="navbar fixed-top navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                <button
                    className="navbar-toggler me-2"
                    type="button"
                    onClick={toggleSidenav}
                >
                    <i className={`fas fa-${sidenavOpen ? 'times' : 'bars'}`}></i>
                </button>

                <Link className="navbar-brand mx-auto" to="/">
                    <h1 className="m-0">E-Commerce</h1>
                </Link>

                <div className="d-flex">
                    <button className="btn btn-link text-white me-2">
                        <i className="fas fa-bell" style={{ fontSize: '1.25rem' }}></i>
                    </button>
                    <button className="btn btn-link text-white me-2">
                        <i className="fas fa-shopping-cart" style={{ fontSize: '1.25rem' }}></i>
                    </button>
                    <button className="btn btn-outline-light">
                        Login / Sign Up
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
