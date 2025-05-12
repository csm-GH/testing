import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message, Menu } from 'antd';
import axios from 'axios';

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getOrderList();
  }, []);

  // 获取订单列表
  const getOrderList = () => {
    axios.get('http://localhost:3001/api/orders')
    .then(response => {
      console.log("订单信息获取成功", response.data);
      setOrders(response.data);
    })
    .catch(error => {
      console.error("订单信息获取失败", error);
      message.error('订单加载失败，请稍后重试');
    });
  };
  
  // 跳转到添加订单页面
  const gotoAddProduct = () => {
    navigate('/admin/add-product'); 
  };

  // 删除订单
  const removeProduct = (orderId) => {
    axios.delete(`http://localhost:3001/api/orders/${orderId}`)
    .then(response => {
      message.success("Delete success");
      getOrderList();
    })
    .catch(error => {
      console.error("删除失败", error);
      message.error("删除失败，请稍后重试");
    });
  };
  const categories = Array.from(new Set(orders.map(p => p.category)));

  // 过滤订单（根据分类和搜索词）
  const filteredProducts = orders.filter(order => {
    const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(order.category);
    const searchMatch = order.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // 日期时间格式化
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  }


  return (
    <main className="admin-product-list">
      <div className="table-header">
        <h2 className="text-2xl font-bold mb-4">Order Management</h2>
        {/* <button 
          onClick={gotoAddProduct} 
          className="ant-btn ant-btn-primary w-full"
        >
          添加订单
        </button> */}
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="p-3 border-b text-left">Num</th>
            <th className="p-3 border-b text-left">Order ID</th>
            <th className="p-3 border-b text-left">Prodect List</th>
            <th className="p-3 border-b text-left">Product value</th>
            <th className="p-3 border-b text-left">Quantity</th>
            <th className="p-3 border-b text-left">Order time</th>
            {/* <th className="p-3 border-b text-left">订单状态</th> */}
            <th className="p-3 border-b text-left">Operate</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((order, index) => (
            <tr key={order.OrderID} className="hover:bg-gray-50">
              <td className="p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b">{order.OrderID}</td>
              <td className="p-3 border-b">{order.ProductName}</td>
              <td className="p-3 border-b">{ order.ProductPrice}</td>
              <td className="p-3 border-b">{order.Number}</td>
              <td className="p-3 border-b">{formatDate(order.OrderDate)}</td>
              <td className="p-3 border-b">
                {/* <button 
                  onClick={() => navigate(`/admin/add-product/${order.OrderID}`)}
                  className="ant-btn ant-btn-sm ant-btn-link"
                >
                  修改
                </button> */}
                <button 
                  onClick={() => removeProduct(order.OrderID)}
                  className="ant-btn ant-btn-sm ant-btn-danger"
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
