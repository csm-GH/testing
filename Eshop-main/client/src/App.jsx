import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import AuthPage from './components/AuthPage/AuthPage.jsx';
import ProductPage from './components/ProductPage/ProductPage.jsx';
import ProductInfoPage from './components/ProductInfoPage/ProductInfoPage.jsx';
import AdminPage from './components/AdminPage/AdminPage.jsx'
import CartPage from './components/CartPage/CartPage.jsx'; 
import OrdersPage from './components/OrdersPage/OrdersPage.jsx'; 
import AddProductPage from './components/AdminPage/Product/AddProductPage.jsx';
import AddCategoryPage from './components/AdminPage/Category/AddCategory.jsx';

function App() {

  const [userName, setUserName] = useState(null); 

  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]); 

  

  useEffect(() => {
    //check user info in sessionStorage
      const sessionUserId = sessionStorage.getItem('userId');
      const sessionUserName = sessionStorage.getItem('userName');
      const sessionIsAdmin = sessionStorage.getItem('isAdmin');

      console.log('sessionUserName :>> ', sessionUserName);
      console.log('userName :>> ', sessionUserName);

      setUserName(sessionUserName);
      setIsAdmin(sessionIsAdmin);

  }, []);

  // Add to cart function
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, 50);
        message.success(`Add to cart successfully`);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        message.success(`Add to cart successfully`);
        if (quantity > 50) {
          message.warning('You can only purchase a maximum of 50 items of this product');
          return prevCart;
        }
        return [...prevCart, { ...product, quantity: Math.min(quantity, 50) }];
      }

    });
  };
 // remove from cart function
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

// update quantity function
  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => prevCart.map(item =>
      item.id === productId? {...item, quantity: newQuantity } : item
    ));
  };

  const handleLogin = (username) => {
    console.log(`[App.jsx]: user ${username} logging in`);
    if(username == "admin") {
      console.log("admin login");
      sessionStorage.setItem('isAdmin', 1)
      setIsAdmin(true);
    }

    // setUserId(userInfo.userId);
    // setUserInfo(username);
    setUserName(username);
    
  };

  const handleLogout = () => {
    console.log(`[App.jsx]: user ${userName} logging out`);

    sessionStorage.removeItem('userInfo');
    // sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('isAdmin');

    setUserName(null);
    // setUserId(null);
    // setUserInfo(null);
    setIsAdmin(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !userName ? (  
            <AuthPage onLogin={handleLogin} />
          ) : isAdmin ? (
            <Navigate to="/adminPage" replace />
          ) : (
            <Navigate to="/productPage" replace />  // default to productPage
          )
        }
      />
      <Route
        path="/productPage"
        element={
          !userName ? (  
            <Navigate to="/login" replace />
          ) :  (
            <ProductPage userName={userName} onLogout={handleLogout} addToCart={addToCart} />  // default to productPage
          )
        }
      />
      <Route
        path="/adminPage"
        element={
          isAdmin ? (
            <AdminPage userName={userName} onLogout={handleLogout}/>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/product/:productId"
        element={
          userName ? (
            <ProductInfoPage userName={userName} onLogout={handleLogout} cart={cart} addToCart={addToCart}/>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Shopping cart page routing */}
      <Route
        path="/cart"
        element={
          userName ? (
            <CartPage 
              userName={userName} 
              onLogout={handleLogout} 
              cartItems={cart} 
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/order"
        element={
          userName ? (
            <OrdersPage userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={userName ? "/productPage" : "/login"} replace />} />
      <Route
        path="/admin/add-product/:productId?"
        element={
          userName ? (
            <AddProductPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/add-category/:categoryId?"
        element={
          userName ? (
            <AddCategoryPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

    </Routes>
  );
}

export default App;
