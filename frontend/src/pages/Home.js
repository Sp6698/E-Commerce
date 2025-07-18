import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import AdminOrders from '../components/AdminOrders';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { fetchApis } from '../util/commonAPI';
import { toast } from 'react-toastify';

const Home = () => {
    const { role } = useAuthStore(); // ✅ Reactive role from store
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetchApis('/product/all', {}, 'get');
            if (res.hasError) {
                console.log("getAllProducts", res);
                toast[res.status](res.message);
                return
            }
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (role === 'admin') return <AdminOrders />;

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h2 className="mb-3 mb-md-0">Our Products</h2>
                <InputGroup style={{ width: '300px' }}>
                    <Form.Control
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary"><i className="fas fa-search"></i></Button>
                </InputGroup>
            </div>
            <Row className="products-grid">
                {filteredProducts.map(product => (
                    <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;
