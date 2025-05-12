import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './CartPage.css';
import axios from 'axios';

export default function CartPage({ userName, onLogout, cartItems, removeFromCart, updateQuantity }) {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };
  
  const handleCheckout = async() => {
    if (cartItems.length === 0) {
      message.warning('购物车为空，无法结算');
      return;
    }

    // 检查库存
    const outOfStockItems = cartItems.filter(item => item.quantity > item.stock);
    if (outOfStockItems.length > 0) {
      message.error(`以下商品库存不足：${outOfStockItems.map(item => item.title).join(', ')}`);
      return;
    }


    try {
      // 这里可以添加实际的结算逻辑（如调用API）
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));


      // 假设结算成功后清空购物车
      const promise = new Promise((resolve, reject) => {
        try {
          cartItems.forEach(async item => {
            const ordersRes = await axios.post('http://localhost:3001/api/orders', {
              UserID: userInfo.userId
            })
            const orderId = ordersRes.data.orderId;
            const buyRes = await axios.post('http://localhost:3001/api/order-items', {
              OrderID: orderId,
              ProductID: item.id,
              Number: item.quantity
            })
          })
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })
      promise.then(() => {
        // 清空购物车
        cartItems.forEach(item => {
          removeFromCart(item.id);
        })
        message.success('Thank you for purchasing!');
      })

     
    } catch (error) {
      message.error('网络请求失败，请稍后重试');
      console.error('结算错误:', error);
      return;
    }

  };


  return (
    <div className="cart-page">
      <header className="header">
        <div className="greeting">Hello, {userName}</div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <Link to="/" className="back-link">← Homepage</Link>
        </div>
      </header>

      <main className="cart-content">
        {cartItems.length === 0 ? (
          <p className="empty-cart">The shopping cart is empty!</p>
        ) : (
          <div className="cart-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <img src={item.image} alt={item.title} className="item-image" />
                  <div className="item-details">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-price">单价：${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="item-quantity">
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value, 10);
                      if (newQty >= 1 && newQty <= item.stock) {
                        updateQuantity(item.id, newQty);
                      }
                    }}
                    className="quantity-input"
                  />
                </div>
                <div className="item-total">
                  Subtotal：${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.id)}
                >
                  Delete
                </button>
              </div>
            ))}

            <div className="total-section">
              <h3>Total：${totalPrice.toFixed(2)}</h3>
              <button className="checkout-btn" onClick={handleCheckout}>
                Pay
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}