// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import CartDropdown from './CartDropdown';

const Navbar = ({ toggleSidenav, sidenavOpen }) => {
    const [showDropdown, setShowDropdown] = useState({
        profile: false,
        notifications: false,
        cart: false
    });

    const dropdownRefs = {
        profile: useRef(null),
        notifications: useRef(null),
        cart: useRef(null)
    };

    const toggleDropdown = (dropdown) => {
        setShowDropdown(prev => ({
            ...prev,
            [dropdown]: !prev[dropdown],
            ...(dropdown !== 'profile' && { profile: false }),
            ...(dropdown !== 'notifications' && { notifications: false }),
            ...(dropdown !== 'cart' && { cart: false })
        }));
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdownRefs).forEach(key => {
                if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
                    setShowDropdown(prev => ({ ...prev, [key]: false }));
                }
            });
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar fixed-top navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                <button className="navbar-toggler me-2" onClick={toggleSidenav}>
                    <i className={`fas fa-${sidenavOpen ? 'times' : 'bars'}`}></i>
                </button>

                <Link className="navbar-brand mx-auto" to="/">
                    <h1 className="m-0">E-Commerce</h1>
                </Link>

                <div className="d-flex align-items-center gap-3">
                    {/* Notification Dropdown */}
                    <div ref={dropdownRefs.notifications} className='px-2'>
                        <button
                            className="btn btn-link text-white position-relative p-0"
                            onClick={() => toggleDropdown('notifications')}
                        >
                            <i className="fas fa-bell fs-5"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                3
                            </span>
                        </button>
                        {showDropdown.notifications && <NotificationDropdown />}
                    </div>

                    {/* Cart Dropdown */}
                    <div ref={dropdownRefs.cart} className='px-2'>
                        <button
                            className="btn btn-link text-white position-relative p-0"
                            onClick={() => toggleDropdown('cart')}
                        >
                            <i className="fas fa-shopping-cart fs-5"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                2
                            </span>
                        </button>
                        {showDropdown.cart && <CartDropdown />}
                    </div>

                    {/* Profile Dropdown */}
                    <div ref={dropdownRefs.profile} className='px-2'>
                        <button
                            className="btn btn-link text-white p-0"
                            onClick={() => toggleDropdown('profile')}
                        >
                            <i className="fas fa-user-circle fs-4"></i>
                        </button>
                        {showDropdown.profile && <ProfileDropdown onClose={() => toggleDropdown('profile')} />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
