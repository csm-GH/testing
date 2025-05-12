import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message, Menu } from 'antd';
import axios from 'axios';

export default function ProductTable({ }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getCategoryList();
  }, []);


  const getCategoryList = () => {
    axios.get('http://localhost:3001/api/category-types')
    .then(response => {
      console.log("Successfully obtained classified information", response.data);
      setCategoryList(response.data);
    })
    .catch(error => {
      console.error("Failed to obtain classified information", error);
      message.error('Category loading failed, please try again later');
    });
  };
  

  const gotoAddCategory = () => {
    navigate('/admin/add-category'); 
  };


  const removeProduct = (productId) => {
    axios.delete(`http://localhost:3001/api/category-types/${productId}`)
    .then(response => {
      message.success("Delete success");
      getCategoryList();
    })
    .catch(error => {
      console.error("Deletion failed", error);
      message.error("Deletion failed, please try again later");
    });
  };
  const categories = Array.from(new Set(categoryList.map(p => p.category)));


  const filteredCategoryList = categoryList.filter(category => {
    const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(category.typeName);
    return categoryMatch;
  });

  return (
    <main className="admin-product-list">
      <div className="table-header">
        <h2 className="text-2xl font-bold mb-4">Categories Management</h2>
        <button 
          onClick={gotoAddCategory} 
          className="ant-btn ant-btn-primary w-full"
        >
          Add Category
        </button>
      </div>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="p-3 border-b text-left">Num</th>
            <th className="p-3 border-b text-left">Category Name</th>
            <th className="p-3 border-b text-left">Operate</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategoryList.map((category, index) => (
            <tr key={category.TypeID} className="hover:bg-gray-50">
              <td className="p-3 border-b">{index + 1}</td>
              <td className="p-3 border-b">{category.TypeName}</td>
              <td className="p-3 border-b">
                <button 
                  onClick={() => navigate(`/admin/add-category/${category.TypeID}`)}
                  className="ant-btn ant-btn-sm ant-btn-link"
                >
                  Modify
                </button>
                <button 
                  onClick={() => removeProduct(category.TypeID)}
                  className="ant-btn ant-btn-sm ant-btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      {categoryList.length === 0 && (
        <div className="mt-4 text-center">No data</div>
      )}
    </main>
  );
}