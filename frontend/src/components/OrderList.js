// src/components/OrderList.js
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchApis } from '../util/commonAPI'; // adjust path if needed

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    const getOrders = async () => {
        try {
            const response = await fetchApis('/order/getOrderList', {}, 'get', true); // your backend endpoint
            if (response.hasError) {
                toast[response.status](response.message);
                return;
            }
            setOrders(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while fetching orders");
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const handleAction = (type, id) => {
        toast.info(`${type} action in progress for order ${id}`);
        // implement actual logic here if needed
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
                                    <th>Customer</th>
                                    <th>Mobile No</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>Payment Mode</th>
                                    <th>Address</th>
                                    <th>Order Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{order.userName}</td>
                                            <td>{order.mobile}</td>
                                            <td>{order.productName}</td>
                                            <td>{order.qty}</td>
                                            <td>₹{order.rate}</td>
                                            <td>{order.paymentMode}</td>
                                            <td>{order.address}</td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleAction("Accept", index)}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleAction("Reject", index)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
