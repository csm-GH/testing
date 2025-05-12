import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message, Menu } from 'antd';
import axios from 'axios';

export default function ProductTable({ }) {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getProductList();
  }, []);


  const getProductList = () => {
    axios.get('http://localhost:3001/api/products')
    .then(response => {
      console.log("Product information obtained successfully", response.data);
      setProducts(response.data);
    })
    .catch(error => {
      console.error("Failed to obtain product information", error);
      message.error('Product loading failed, please try again later');
    });
  };
  
  
  const gotoAddProduct = () => {
    navigate('/admin/add-product'); 
  };

  const removeProduct = (productId) => {
    axios.delete(`http://localhost:3001/api/products/${productId}`)
    .then(response => {
      message.success("Delete success");
      getProductList();
    })
    .catch(error => {
      console.error("Deletion failed", error);
      message.error("Deletion failed, please try again later");
    });
  };
  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(product.category);
    const searchMatch = product.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <main className="admin-product-list">
      <div className="table-header">
        <h2 className="text-2xl font-bold mb-4">Product Management</h2>
        <button 
          onClick={gotoAddProduct} 
          className="ant-btn ant-btn-primary w-full"
        >
          Add
        </button>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="p-3 border-b text-left">Num</th>
            <th className="p-3 border-b text-left">Name</th>
            <th className="p-3 border-b text-left">Image</th>
            <th className="p-3 border-b text-left">Value</th>
            <th className="p-3 border-b text-left">Inventory</th>
            <th className="p-3 border-b text-left">Operate</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product.ProductID} className="hover:bg-gray-50">
              <td className="p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b">{product.ProductName}</td>
              <td className="p-3 border-b">
                <img
                  src={product.ProductImageURL}
                  alt={product.ProductName}
                  className="table-td-img"
                  mode="aspectFit"
                />
              </td>
              <td className="p-3 border-b">{product.ProductPrice}</td>
              <td className="p-3 border-b">{product.ProductStock}</td>
              <td className="p-3 border-b">
                <button 
                  onClick={() => navigate(`/admin/add-product/${product.ProductID}`)}
                  className="ant-btn ant-btn-sm ant-btn-link"
                >
                  Modify
                </button>
                <button 
                  onClick={() => removeProduct(product.ProductID)}
                  className="ant-btn ant-btn-sm ant-btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}