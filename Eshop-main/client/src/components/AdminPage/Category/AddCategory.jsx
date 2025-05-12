import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); 
  const [form] = Form.useForm();  
  const [isEditMode, setIsEditMode] = useState(false); 

  useEffect(() => {
    if (categoryId) {
      setIsEditMode(true);
      axios.get(`http://localhost:3001/api/category-types`, {
        params: {
          typeId: categoryId
        }
      })
        .then(res => {
          form.setFieldsValue({
            TypeName: res.data.TypeName
          });
        })
        .catch(err => {
          message.error('Failed to obtain category information');
          navigate('/adminPage');
        });
    }
  }, [categoryId, form, navigate]);

  const onFinish = async (values) => {
    try {
      let response;
      if (isEditMode) {
        response = await axios.put(`http://localhost:3001/api/category/update?typeId=${categoryId}`, values);
      } else {
        response = await axios.post('http://localhost:3001/api/category-type', values);
      }

      if (response.status == 200) {
        message.success(isEditMode ? 'Category modification successful' : 'Category added successfully');
        navigate('/adminPage');
      } else {
        message.error(response.data.msg || (isEditMode ? 'Category modification failed' : '分Category added failed'));
      }
    } catch (err) {
      message.error(err.response.data.error);
      console.error(isEditMode ? 'Edit Category Error' : 'Add category error', err.response.data.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {isEditMode ? 'Edit Category' : 'Add Category'}
      </h2>
      
      <Form
        form={form}
        name="addCategory"
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
        className="space-y-4"
      >
        <Form.Item
          name="TypeName"
          label="Category Name"
          rules={[{ required: true, message: 'Enter the category name' }]}
        >
          <Input placeholder="Enter the category name" />
        </Form.Item>

        {/* submit button */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full"
            style={{ height: '40px' }}
          >
            {isEditMode ? 'Submit Changes' : 'Submit Add'}
          </Button>
          <Button 
            type="default" 
            htmlType="button"   
            className="w-full"
            style={{ height: '40px' }}
            onClick={() => navigate(-1)}
          >
            Return
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductPage;