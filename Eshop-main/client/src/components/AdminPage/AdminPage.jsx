import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Menu } from 'antd';
import './AdminPage.css';
import axios from 'axios';
import ProductTable from './Product/ProductTable';
import CategoryTable from './Category/CategoryTable';
import OrderTable from './Order/OrderTable';

export default function AdminPage({ userName, onLogout }) {
  
  const navigate = useNavigate();
  const [currentMenuKey, setCurrentMenuKey] = useState('product'); 


  const handleMenuClick = ({ key }) => {
    setCurrentMenuKey(key); 
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-page min-h-screen flex">

      <div className="bg-gray-100 w-64 p-4 border-r">
        <div className="text-2xl font-bold mb-4">Admin</div>
        <Menu
          mode="inline"
          selectedKeys={[currentMenuKey]}
          onClick={handleMenuClick}
          items={[
            { key: 'product', label: 'Product Management' },
            { key: 'category', label: 'Filter Management' },
            { key: 'order', label: 'Order Management' },
          ]}
        />
      </div>


      <div className="flex-1 p-6 content-wrapper">
        <header className="header">
          <div className="greeting text-xl font-semibold">Hello, {userName}</div>
          <button 
            onClick={handleLogout} 
            className="ant-btn ant-btn-default"
          >
            Logout
          </button>
        </header>
        <div className="content">
    
          {currentMenuKey === 'product' && <ProductTable />}
          {currentMenuKey === 'category' && <CategoryTable />}
          {currentMenuKey === 'order' && <OrderTable />}
        </div>
      </div>
    </div>
  );
}