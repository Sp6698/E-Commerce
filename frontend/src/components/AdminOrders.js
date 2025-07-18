import React from 'react';

const AdminOrders = () => {
    const orders = [
        { id: 1, customer: 'John Doe', items: 3, status: 'Delivered' },
        { id: 2, customer: 'Jane Smith', items: 1, status: 'Returned' },
        { id: 3, customer: 'Alice', items: 2, status: 'Processing' },
    ];

    return (
        <div className="p-4">
            <h2>Customer Orders</h2>
            <table className="table table-bordered mt-3">
                <thead className="table-light">
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.items}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;
