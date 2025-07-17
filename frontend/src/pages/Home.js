// src/components/ProductCard.js
import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            className={`shadow-sm ${isHovered ? 'product-card-hover' : ''}`}
            style={{
                width: '250px',
                height: '400px',
                transition: 'all 0.3s ease',
                zIndex: isHovered ? 10 : 1
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="ratio ratio-1x1 bg-light">
                <Card.Img
                    variant="top"
                    src={`/images/products/electronics/${product.image}`} // Use dynamic image path
                    alt={product.name}
                    style={{
                        objectFit: 'cover', // Maintain aspect ratio
                        width: '100%', // Full width of the card
                        height: '100%', // Full height of the card
                    }}
                />
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6 mb-1">{product.name}</Card.Title>
                <Card.Text className="text-danger mb-1 fw-bold">${product.price.toFixed(2)}</Card.Text>
                <Badge bg="success" className="mb-2">Save ${product.discount}</Badge>
                <div className="small text-muted mb-2">
                    <i className="fas fa-box-open me-1"></i> {product.stock} available
                </div>
                <Button
                    variant={isHovered ? 'primary' : 'outline-primary'}
                    className="mt-auto"
                >
                    <i className="fas fa-cart-plus me-1"></i> Add to Cart
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
