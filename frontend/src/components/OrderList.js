// src/components/OrderList.js
import React from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const mockOrders = [
    {
        id: 1,
        product: "Wireless Mouse",
        customer: "John Doe",
        address: "123 Main St, Mumbai",
        price: 499,
        status: "Pending",
        mobile: "9876543210"
    },
    {
        id: 2,
        product: "Bluetooth Speaker",
        customer: "Jane Smith",
        address: "456 Hill Rd, Pune",
        price: 1599,
        status: "Pending",
        mobile: "8765432109"
    }
];

const OrderList = () => {
    const handleAction = (type, id) => {
        toast.info(`${type} action in progress for order ${id}`);
    };

    return (
        <div className="container my-5">
            <div className="card shadow">
                <div className="card-body">
                    <h4 className="mb-4">Order List</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle text-center">
                            <thead className="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Mobile No</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.product}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.address}</td>
                                        <td>₹{order.price}</td>
                                        <td>{order.status}</td>
                                        <td>{order.mobile}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleAction("Accept", order.id)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleAction("Reject", order.id)}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
