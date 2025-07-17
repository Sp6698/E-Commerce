// src/components/ProductCard.js
import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const ProductCard = ({ product }) => {
    return (
        <Card className="h-100 shadow-sm border-0">
            <div className="ratio ratio-1x1 bg-light position-relative">
                <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="p-3 object-fit-contain"
                />
                {product.offer && (
                    <Badge
                        bg="danger"
                        className="position-absolute top-0 end-0 m-2"
                    >
                        {product.offer}
                    </Badge>
                )}
            </div>
            <Card.Body className="d-flex flex-column pt-1 pb-3">
                <Card.Title className="fs-6 mb-1">{product.name}</Card.Title>
                <Card.Text className="mb-1">
                    <span className="text-primary fw-bold">${product.price}</span>
                    {product.originalPrice && (
                        <span className="text-decoration-line-through text-muted ms-2">${product.originalPrice}</span>
                    )}
                </Card.Text>
                <Card.Text className="small text-muted mb-2">
                    <i className="fas fa-tag me-1"></i>
                    {product.category}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center small">
                    <span className="text-success">
                        <i className="fas fa-check-circle me-1"></i>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                    <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
