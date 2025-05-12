import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductInfoPage.css';
import { message } from 'antd';
import axios from 'axios';

export default function ProductInfoPage({ userName, onLogout, addToCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getProductInfo();
  }, [productId, navigate]);

  // get product info from server
  const getProductInfo = async() => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products`, {
        params: {
          productId: productId
        }
      });
      if (response.status == 200) {
        const product = {
          id: response.data.ProductID,
          title: response.data.ProductName,
          // category: response.data.ProductCategory,
          price: response.data.ProductPrice,
          description: response.data.ProductDescription,
          // image: response.data.ProductImage
        }
        setProduct(product); 
      } else {
        message.error(response.data.msg || 'Failed to obtain product information');
      }
    } catch (error) {
      message.error('The network request failed, please try again later');
      console.error('Error in getting product details:', error);
    }
  }

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (!product) return <div>Loading product info...</div>;

  return (
    <div className="product-info-page">
      <header className="header">
        <div className="greeting">Hello, { userName }</div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <Link to="/cart" className="cart-icon" title="Go to cart">
            <img src="/src/img/shopping-cart-outline-svgrepo-com.svg" alt="Shopping Cart" />
          </Link>
        </div>
      </header>

      <main className="product-info-content">
        <div className="image-container">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="details-container">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-category"><strong>Category:</strong> {product.category}</p>
          <p className="product-price"><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          {/* Quantity input and Add to Cart button */}
          <div className="add-to-cart">
            <input
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={e => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 50) val = 50;
                setQuantity(val);
              }}
              className="quantity-input"
            />
            <button onClick={handleAddToCart}>Add</button>
          </div>

          <Link to="/" className="back-link">← Back to Products</Link>
        </div>
      </main>
    </div>
  );
}
