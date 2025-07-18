import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import AdminOrders from '../components/AdminOrders';
import { useAuthStore } from '../store/authStore';

const Home = () => {
    const { role } = useAuthStore(); // ✅ Reactive role from store
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        { id: 1, name: "Wireless Headphones", price: 99.99, discount: 20, stock: 15, image: "headphones.jpg" }
    ];

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
