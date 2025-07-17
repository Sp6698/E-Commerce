// src/components/CartDropdown.js
import React from 'react';

const cartItems = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        quantity: 1,
        thumbnail: "https://placehold.co/100x100?text=Headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        quantity: 2,
        thumbnail: "https://placehold.co/100x100?text=Smart+Watch"
    }
];

const CartDropdown = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="dropdown-menu show end-0 mt-2 p-0 shadow" style={{
            width: '350px',
            maxHeight: '400px',
            overflowY: 'auto'
        }}>
            <div className="px-3 py-2 border-bottom bg-light">
                <h6 className="m-0">Your Cart ({cartItems.length})</h6>
            </div>

            <div className="list-group list-group-flush">
                {cartItems.map(item => (
                    <div key={item.id} className="list-group-item">
                        <div className="d-flex gap-3 align-items-center">
                            <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="rounded"
                                width="60"
                                height="60"
                            />
                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between">
                                    <h6 className="mb-1">{item.name}</h6>
                                    <small className="text-muted">${item.price.toFixed(2)}</small>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">Qty: {item.quantity}</small>
                                    <small className="text-primary">${(item.price * item.quantity).toFixed(2)}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-3 py-2 border-top bg-light">
                <div className="d-flex justify-content-between mb-2">
                    <strong>Subtotal:</strong>
                    <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-sm">View Cart</button>
                    <button className="btn btn-outline-primary btn-sm">Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default CartDropdown;
