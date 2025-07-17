// src/pages/Home.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

const Home = () => {
    // Enhanced mock data
    const products = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 89.99,
            originalPrice: 129.99,
            offer: "30% OFF",
            category: "Electronics",
            stock: 15,
            image: "https://placehold.co/600x600?text=Headphones"
        },
        {
            id: 2,
            name: "Sleek Smartphone Case",
            price: 19.99,
            category: "Accessories",
            stock: 42,
            image: "https://placehold.co/600x600?text=Phone+Case"
        },
        {
            id: 3,
            name: "Fast Wireless Charger",
            price: 29.99,
            offer: "Limited Deal",
            category: "Electronics",
            stock: 8,
            image: "https://placehold.co/600x600?text=Charger"
        },
        {
            id: 4,
            name: "Portable Bluetooth Speaker",
            price: 79.99,
            category: "Electronics",
            stock: 0,
            image: "https://placehold.co/600x600?text=Speaker"
        },
        {
            id: 5,
            name: "Ergonomic Wireless Mouse",
            price: 39.99,
            originalPrice: 49.99,
            offer: "20% OFF",
            category: "Accessories",
            stock: 22,
            image: "https://placehold.co/600x600?text=Mouse"
        },
        {
            id: 6,
            name: "Mechanical Keyboard",
            price: 89.99,
            category: "Accessories",
            stock: 14,
            image: "https://placehold.co/600x600?text=Keyboard"
        },
        {
            id: 7,
            name: "HD Webcam",
            price: 49.99,
            offer: "New",
            category: "Electronics",
            stock: 7,
            image: "https://placehold.co/600x600?text=Webcam"
        },
        {
            id: 8,
            name: "USB-C Hub",
            price: 34.99,
            category: "Accessories",
            stock: 19,
            image: "https://placehold.co/600x600?text=USB+Hub"
        }
    ];

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Featured Products</h2>
                <button className="btn btn-outline-primary btn-sm">View All</button>
            </div>
            <Row className="g-4">
                {products.map(product => (
                    <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;
