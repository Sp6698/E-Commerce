import StarIcon from '@mui/icons-material/Star';
import { Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { fetchApis } from '../util/commonAPI';

const ProductCard = ({ product }) => {
    if (!product) return null;

    const {
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
                return
            }
            const response = await fetchApis('/cart/addToCart', {
                userId: localStorage.getItem('userId'),
                productId: product.id,
                quantity: 1
            }, 'post', true);
            console.log('Add to Cart Success:', response);
            toast[response.status](response.message);
            if (response.hasError) {
                return
            }
        } catch (error) {
            console.error('Add to Cart Error:', error);
            toast.error(error.message);
        }
    };

    const handleBuyNow = async (product) => {
        console.log('Buying now:', product);
        // You might redirect to payment or checkout here
    };

    return (
        <Card className="p-2" style={{ width: '250px', fontSize: '15px' }}>
            <Card.Img
                variant="top"
                src={`data:image/jpeg;base64,${base64Image}`}
                alt={name}
                style={{ height: '150px', objectFit: 'contain', borderRadius: '5px' }}
            />
            <Card.Body className="p-2">
                <Card.Title style={{ fontSize: '16px', marginBottom: '4px' }}>{name}</Card.Title>
                <div style={{ marginBottom: '4px' }}><strong>Company:</strong> {company}</div>
                <div style={{ marginBottom: '4px' }}><strong>Qty:</strong> {qty}</div>
                <div style={{ marginBottom: '4px' }}><strong>Rate:</strong> ₹{rate?.toFixed(2)}</div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <StarIcon sx={{ color: '#fbc02d', fontSize: '16px' }} />
                    <span style={{ fontSize: '13px', marginLeft: '4px' }}>{rating}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
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
                        onClick={() => handleBuyNow(product)}
                    >
                        Buy
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;
