import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); 
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(''); 

  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      axios.get(`http://localhost:3001/api/products`, {
        params: {
          productId: productId
        }
      })
        .then(res => {
          form.setFieldsValue({
            title: res.data.ProductName,
            price: res.data.ProductPrice,
            stock: res.data.ProductStock,
            description: res.data.ProductDescription
          });
          if (res.data.ProductImage) {
            setPreviewUrl(res.data.ProductImageURL);
          }
        })
        .catch(err => {
          message.error('Failed to obtain product information');
          navigate('/adminPage');
        });
    }
  }, [productId, form, navigate]);

  const onFinish = async (values) => {
    try {
      let response;
      values.ProductImage = selectedFile;
      if (isEditMode) {
        response = await axios.put(`http://localhost:3001/api/products/update?productId=${productId}`, values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('http://localhost:3001/api/products', values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.status === 200) {
        message.success(isEditMode ? 'Product modification successful' : 'Product added successfully');
        navigate('/adminPage');
      } else {
        message.error(response.data.msg || (isEditMode ? 'Product modification failed' : 'Failed to add product'));
      }
    } catch (err) {
      message.error('The network request failed, please try again later');
      console.error(isEditMode ? 'Edit product error' : 'Error adding product', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;


    if (!file.type.startsWith('image/')) {
      message.error('Only supports uploading image files');
      e.target.value = ''; 
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {isEditMode ? 'Edit product' : 'Add new product'}
      </h2>
      
      <Form
        form={form}
        name="addProduct"
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
        className="space-y-4"
      >

        <Form.Item
          name="title"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter the product name' }]}
        >
          <Input placeholder="Enter the full name of the product" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Product price (HKD)"
          rules={[{ required: true, type: 'number', min: 0, message: 'Please enter a valid price' }]}
        >
          <InputNumber 
            min={0} 
            step={1} 
            placeholder="Enter the product price" 
            style={{ width: '100%' }}
          />
        </Form.Item>


        <Form.Item
          name="stock"
          label="stock"
          rules={[{ required: true, type: 'number', min: 0, message: 'Enter Stock' }]}
        >
          <InputNumber 
            min={0} 
            step={1} 
            placeholder="Enter the product stock" 
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Product description"
          rules={[{ required: true, message: 'Please enter a product description' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter a detailed description of the product" />
        </Form.Item>

        <Form.Item
          name="ProductImage"
          label="Product image"
          rules={[{ required: true, message: 'Please upload product pictures' }]}
        >
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '150px', backgroundImage: `url(${previewUrl})` }}
                className="rounded"
              />
            )}
            {isEditMode && !previewUrl && <span className="text-gray-500">There are currently no images</span>}
          </div>
        </Form.Item>

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