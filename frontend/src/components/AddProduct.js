import React, { useState } from 'react';
import {
    TextField, Button, Paper, Typography, Rating
} from '@mui/material';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchApis } from '../util/commonAPI';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: '', qty: '', description: '', rate: '', rating: 0, company: ''
    });
    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState('');
    const [preview, setPreview] = useState('');

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (_, newValue) => {
        setProduct({ ...product, rating: newValue });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();

            // Preview
            reader.onloadend = () => {
                setPreview(reader.result);
                const base64 = reader.result.split(',')[1]; // remove data:image/... prefix
                setBase64Image(base64);
            };

            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const { name, qty, description, rate, rating, company } = product;
        if (!name || !qty || !description || !rate || !company || !rating) {
            toast.error("All fields (except image) are required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newProduct = {
            ...product,
            base64Image: base64Image || null
        };

        try {
            const productRes = await fetchApis('/product/add', newProduct, 'post', true);
            console.log("productRes", productRes);
            if (productRes.hasError) {
                toast[productRes.status](productRes.message);
                return
            }
            handleClear();
        } catch (error) {
            toast.error("Server error: " + error.message);
        }
    };
    const handleClear = () => {
        setProduct({ name: '', qty: '', description: '', rate: '', rating: 0, company: '' });
        setImage(null);
        setPreview('');
        setBase64Image('');
    }
    return (
        <div className="container my-5">
            <Paper elevation={3} className="p-4">
                <Typography variant="h5" className="mb-4">Add New Product</Typography>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Left side - form inputs */}
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <TextField
                                        label="Product Name" name="name" value={product.name}
                                        onChange={handleChange} fullWidth size="small"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <TextField
                                        label="Quantity" name="qty" value={product.qty}
                                        onChange={handleChange} fullWidth size="small" type="number"
                                    />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <TextField
                                        label="Description" name="description" multiline rows={3}
                                        value={product.description} onChange={handleChange}
                                        fullWidth size="small"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <TextField
                                        label="Rate" name="rate" value={product.rate}
                                        onChange={handleChange} fullWidth size="small" type="number"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <TextField
                                        label="Company" name="company" value={product.company}
                                        onChange={handleChange} fullWidth size="small"
                                    />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <Typography variant="body2" className="mb-1">Rating</Typography>
                                    <Rating
                                        name="rating" value={product.rating}
                                        onChange={handleRatingChange} size="medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right side - image preview */}
                        <div className="col-md-4 d-flex flex-column align-items-center">
                            <Typography variant="body2" className="mb-2">Product Image</Typography>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mb-3" />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="img-fluid rounded shadow"
                                    style={{ maxHeight: 220, objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="text-end mt-4">
                        <Button type="submit" variant="contained" color="primary">Add Product</Button>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default AddProduct;
