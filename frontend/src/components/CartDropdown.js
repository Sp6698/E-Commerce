import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { fetchApis } from '../util/commonAPI';
import { FaTrash } from 'react-icons/fa'; // ✅ Import icon
import ShoppingLoader from './ShoppingLoader';

const CartDropdown = () => {
    const { role } = useAuthStore();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        checkCartStatus();
    }, [role]);

    const checkCartStatus = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        if (!userId || role !== 'customer') {
            setCartItems([]);
            setMessage('Please log in to check cart');
            setLoading(false);
            return;
        }

        try {
            const data = await fetchApis('/cart/getUserCart', { userId }, 'post', true);
            if (data.hasError) {
                toast[data.status](data.message);
                return;
            }

            if (!data.data.length) {
                setMessage('Continue shopping, your cart is empty');
            } else {
                setCartItems(data.data);
                setMessage('');
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch cart.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        const userId = localStorage.getItem('userId');
        try {
            setLoading(true);
            const res = await fetchApis('/cart/removeFromCart', { userId, productId }, 'post', true);
            console.log("remove from cart", res);
            if (res.hasError) {
                setLoading(false);
                toast[res.status](res.message);
                return;
            }
            await checkCartStatus();
        } catch (err) {
            toast.error('Error removing item');
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.totalRate, 0);

    return (
        <div className="dropdown-menu show end-0 mt-2 p-0 shadow" style={{
            width: '350px',
            maxHeight: '400px',
            overflowY: 'auto'
        }}>
            <div className="px-3 py-2 border-bottom bg-light">
                <h6 className="m-0">Your Cart ({cartItems.length})</h6>
            </div>

            {loading ? (
                <ShoppingLoader />
            ) : message ? (
                <div className="p-3 text-center">{message}</div>
            ) : (
                <>
                    <div className="list-group list-group-flush">
                        {cartItems.map(item => (
                            <div key={item.productId} className="list-group-item">
                                <div className="d-flex gap-3 align-items-center">
                                    <img
                                        src={`data:image/jpeg;base64,${btoa(
                                            new Uint8Array(item.image.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                                        )}`}
                                        alt={item.productName}
                                        className="rounded"
                                        width="60"
                                        height="60"
                                    />
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="mb-1">{item.productName}</h6>
                                            <small className="text-muted">₹{item.rate.toFixed(2)}</small>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">Qty: {item.quantity}</small>
                                            <button
                                                title="Remove from cart"
                                                onClick={() => handleRemove(item.productId)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'white',
                                                    backgroundColor: 'red',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    // padding: '5px 10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    fontSize: '10px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                <FaTrash style={{ fontSize: '10px' }} />
                                                Remove
                                            </button>

                                            <small className="text-primary">₹{item.totalRate.toFixed(2)}</small>
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    bottom: '0px',
                                    right: '0px',
                                    zIndex: 10,
                                    padding: '5px'
                                }}>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-3 py-2 border-top bg-light">
                        <div className="d-flex justify-content-between mb-2">
                            <strong>Subtotal:</strong>
                            <strong>₹{subtotal.toFixed(2)}</strong>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-sm">View Cart</button>
                            <button className="btn btn-outline-primary btn-sm">Checkout</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartDropdown;
