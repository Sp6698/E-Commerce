import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { commonAlertForSave, fetchApis } from '../util/commonAPI';

const ProductCard = ({ product }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        quantity: '',
        paymentMode: 'COD',
    });
    const [errors, setErrors] = useState({
        address: '',
        quantity: '',
    });

    if (!product) return null;

    const {
        id,
        name,
        company,
        qty,
        rate,
        rating,
        base64Image
    } = product;

    const handleAddToCart = async (product) => {
        try {
            if (!localStorage.getItem('token')) {
                toast.warn('Please login to add to cart.');
                return;
            }
            const response = await fetchApis('/cart/addToCart', {
                userId: localStorage.getItem('userId'),
                productId: product.id,
                quantity: 1
            }, 'post', true);
            toast[response.status](response.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const validateForm = () => {
        const newErrors = { address: '', quantity: '' };
        let isValid = true;
        const quantity = parseInt(formData.quantity, 10);

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required.';
            isValid = false;
        }

        if (isNaN(quantity) || quantity < 1) {
            newErrors.quantity = 'Quantity must be at least 1.';
            isValid = false;
        } else if (quantity > qty) {
            newErrors.quantity = `Only ${qty} item(s) in stock.`;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleOrder = async () => {
        if (!validateForm()) return;
        let swalRes = await commonAlertForSave('Buy');
        if (!swalRes) {
            return;
        }

        try {
            const data = {
                userId: localStorage.getItem('userId'),
                productId: id,
                qty: formData.quantity,
                paymentMode: formData.paymentMode,
                address: formData.address
            }
            const response = await fetchApis('/order/placeOrder', data, 'post', true);
            toast[response.status](response.message);

            if (response.hasError) {
                return
            }
            handleClear();
            window.location.reload();
        } catch (error) {
            toast.error("Order failed.");
        }
    };

    const handleCancel = () => {
        setFormData({ address: '', quantity: '', paymentMode: 'COD' });
        setErrors({ address: '', quantity: '' });
        setShowDialog(false);
    };
    const handleBuy = () => {
        if (!localStorage.getItem('token')) {
            toast.warn('Please login first to Buy.');
            return;
        }
        setShowDialog(true);
    };
    const handleClear = () => {
        setShowDialog(false);
        setFormData({ address: '', quantity: '', paymentMode: 'COD' });
        setErrors({ address: '', quantity: '' });
    };
    return (
        <>
            <Card className="p-2 d-flex flex-column justify-content-between" style={{ width: '250px', minHeight: '420px', fontSize: '15px' }}>
                <Card.Img
                    variant="top"
                    src={`data:image/jpeg;base64,${base64Image}`}
                    alt={name}
                    className="img-thumbnail mx-auto"
                    style={{
                        height: '150px',
                        width: '100%',
                        objectFit: 'contain',
                        borderRadius: '5px'
                    }}
                />
                <Card.Body className="p-2 d-flex flex-column justify-content-between flex-grow-1">
                    <div className="text-start">
                        <Card.Title style={{ fontSize: '16px', marginBottom: '4px' }}>{name}</Card.Title>
                        <div><strong>Company:</strong> {company}</div>
                        <div><strong>Qty:</strong> {qty}</div>
                        <div><strong>Rate:</strong> ₹{rate?.toFixed(2)}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ color: '#fbc02d', fontSize: '16px' }} />
                            <span style={{ fontSize: '13px', marginLeft: '4px' }}>{rating}</span>
                        </div>
                    </div>

                    <div className="mt-auto d-flex gap-2 pt-3">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="w-50"
                            onClick={() => handleAddToCart(product)}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            className="w-50"
                            onClick={handleBuy}
                        >
                            Buy
                        </Button>
                    </div>
                </Card.Body>
            </Card>


            {/* Order Dialog */}
            <Modal centered show={showDialog} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Your Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                placeholder="Enter delivery address"
                                isInvalid={!!errors.address}
                            />
                            {errors.address && <div className="text-danger mt-1">{errors.address}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                max={qty}
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({ ...formData, quantity: e.target.value })
                                }
                                isInvalid={!!errors.quantity}
                            />
                            {errors.quantity && <div className="text-danger mt-1">{errors.quantity}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Payment Mode</Form.Label>
                            <Form.Select
                                value={formData.paymentMode}
                                onChange={(e) =>
                                    setFormData({ ...formData, paymentMode: e.target.value })
                                }
                            >
                                <option value="COD">Cash on Delivery</option>
                                <option value="Online">Online</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center gap-2">
                    <Button
                        variant="success"
                        onClick={handleOrder}
                        style={{ minWidth: '100px' }}
                    >
                        Order
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCancel}
                        style={{ minWidth: '100px' }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProductCard;
