import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ onClose }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        onClose();
        navigate('/');
    };

    const menuItems = token
        ? [
            { icon: 'shopping-bag', text: 'Orders', path: '/orders' },
            { icon: 'heart', text: 'Wishlist', path: '/wishlist' },
            { icon: 'shopping-cart', text: 'Cart', path: '/cart' },
            { icon: 'user', text: 'Profile', path: '/profile' },
        ]
        : [
            { icon: 'sign-in-alt', text: 'Login', path: '/login' },
            { icon: 'user-plus', text: 'Sign Up', path: '/signup' },
        ];

    return (
        <div
            className="dropdown-menu show position-absolute end-0 mt-2 shadow"
            style={{ minWidth: '200px' }}
            onClick={(e) => e.stopPropagation()}
        >
            {menuItems.map((item, index) => (
                <Link
                    key={index}
                    className="dropdown-item d-flex align-items-center py-2 px-3"
                    to={item.path}
                    onClick={onClose}
                >
                    <i className={`fas fa-${item.icon} me-2`}></i>
                    {item.text}
                </Link>
            ))}

            {token && (
                <button
                    className="dropdown-item d-flex align-items-center py-2 px-3"
                    onClick={handleLogout}
                >
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                </button>
            )}
        </div>
    );
};

export default ProfileDropdown;
