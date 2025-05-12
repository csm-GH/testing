import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './OrdersPage.css';
import axios from 'axios';

export default function MyOrdersPage({ userName, onLogout }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // get user orders
  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo?.userId) {
      message.warning('Please log in first');
      navigate('/login');
      return;
    }

    axios.get('http://localhost:3001/api/orders', {
      params: { userId: userInfo.userId }
    })
    .then(res => {
      if (res.status !== 200) {
        message.error('Failed to obtain order, please try again later');
        return;
      }
      setOrders(res.data);
      console.log('object :>> ', res.data);
    })
    .catch(err => {
      message.error('Failed to obtain order, please try again later');
      console.error('Order acquisition error:', err);
    });
  }, [navigate]);

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

 
  const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="my-orders-page">
      <header className="header">
        <div className="greeting">Hello, {userName}</div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <Link to="/" className="back-link">← Homepage</Link>
        </div>
      </header>

      <main className="orders-content">
        {orders.length === 0 ? (
          <p className="empty-orders">No orders at the moment!</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.OrderID} className="order-item">
                <div className="order-header">
                  <span className="order-id">OrderID：{order.OrderID}</span>
                  <span className="order-time">{formatTime(order.OrderDate)}</span>
                </div>
                <div className="order-products">
                  <div key={order.ProductID} className="product-info">
                    <img src={order.ProductImageURL} alt={order.ProductName} className="product-image" />
                    <div className="product-details">
                      <h4 className="product-title">{order.ProductName}</h4>
                      <p className="product-price">Subtotal：¥{order.ProductPrice.toFixed(2)}</p>
                      <p className="product-quantity">Quantity：{order.Number}</p>
                    </div>
                  </div>
                </div>
                <div className="order-total">
                  Total：¥{ Number(order.ProductPrice * order.Number).toFixed(2) || 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
