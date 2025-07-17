// src/components/NotificationDropdown.js
import React from 'react';

const notifications = [
    {
        id: 1,
        title: "Summer Sale!",
        message: "Get 30% off on all electronics this weekend",
        time: "2 hours ago",
        read: false
    },
    {
        id: 2,
        title: "New Arrival",
        message: "Check out our new collection of smart watches",
        time: "1 day ago",
        read: true
    },
    {
        id: 3,
        title: "Order Shipped",
        message: "Your order #12345 has been shipped",
        time: "3 days ago",
        read: true
    },
    {
        id: 4,
        title: "Special Offer",
        message: "Buy 2 get 1 free on selected items",
        time: "1 week ago",
        read: true
    }
];

const NotificationDropdown = () => {
    return (
        <div className="dropdown-menu show end-0 mt-2 p-0 shadow" style={{
            width: '350px',
            maxHeight: '400px',
            overflowY: 'auto'
        }}>
            <div className="px-3 py-2 border-bottom bg-light">
                <h6 className="m-0">Notifications</h6>
            </div>
            <div className="list-group list-group-flush">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`list-group-item list-group-item-action ${!notification.read ? 'bg-light' : ''}`}
                    >
                        <div className="d-flex justify-content-between">
                            <strong>{notification.title}</strong>
                            {!notification.read && <span className="badge bg-primary">New</span>}
                        </div>
                        <small className="text-muted">{notification.message}</small>
                        <div className="text-end mt-1">
                            <small className="text-muted">{notification.time}</small>
                        </div>
                    </div>
                ))}
            </div>
            <div className="px-3 py-2 border-top bg-light text-center">
                <a href="#view-all" className="text-primary">View All Notifications</a>
            </div>
        </div>
    );
};

export default NotificationDropdown;
