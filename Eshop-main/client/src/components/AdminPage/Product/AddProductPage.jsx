import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // 获取路由中的商品ID（编辑模式时存在）
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false); // 是否为编辑模式
  const [selectedFile, setSelectedFile] = useState(null); // 新增：存储选中的文件
  const [previewUrl, setPreviewUrl] = useState(''); // 新增：图片预览URL

  // 初始化：如果有productId则进入编辑模式
  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      // 获取商品详情并填充表单
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
          // 编辑模式回显图片
          if (res.data.ProductImage) {
            // setPreviewUrl(`data:image/png;base64,${Buffer.from(res.data.ProductImage).toString("base64")}`);
            setPreviewUrl(res.data.ProductImageURL);
          }
        })
        .catch(err => {
          message.error('获取商品信息失败');
          navigate('/adminPage');
        });
    }
  }, [productId, form, navigate]);

  const onFinish = async (values) => {
    try {
      let response;
      values.ProductImage = selectedFile;
      if (isEditMode) {
        // 编辑模式：发送PUT请求更新商品
        response = await axios.put(`http://localhost:3001/api/products/update?productId=${productId}`, values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // 添加模式：发送POST请求创建商品
        response = await axios.post('http://localhost:3001/api/products', values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.status === 200) {
        message.success(isEditMode ? '商品修改成功' : '商品添加成功');
        navigate('/adminPage');
      } else {
        message.error(response.data.msg || (isEditMode ? '商品修改失败' : '商品添加失败'));
      }
    } catch (err) {
      message.error('网络请求失败，请稍后重试');
      console.error(isEditMode ? '编辑商品错误' : '添加商品错误', err);
    }
  };
  // 新增：文件选择处理函数
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 校验文件类型
    if (!file.type.startsWith('image/')) {
      message.error('仅支持上传图片文件');
      e.target.value = ''; // 清空文件选择
      return;
    }

    setSelectedFile(file);
    // 生成预览URL
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {isEditMode ? '编辑商品' : '添加新商品'}
      </h2>
      
      <Form
        form={form}
        name="addProduct"
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
        className="space-y-4"
      >
        {/* 商品名称 */}
        <Form.Item
          name="title"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="输入商品全称" />
        </Form.Item>

        {/* 商品价格 */}
        <Form.Item
          name="price"
          label="商品价格（元）"
          rules={[{ required: true, type: 'number', min: 0, message: '请输入有效价格' }]}
        >
          <InputNumber 
            min={0} 
            step={1} 
            placeholder="输入商品价格" 
            style={{ width: '100%' }}
          />
        </Form.Item>


        {/* 库存 */}
        <Form.Item
          name="stock"
          label="库存"
          rules={[{ required: true, type: 'number', min: 0, message: '请输入库存' }]}
        >
          <InputNumber 
            min={0} 
            step={1} 
            placeholder="输入商品库存" 
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* 商品描述 */}
        <Form.Item
          name="description"
          label="商品描述"
          rules={[{ required: true, message: '请输入商品描述' }]}
        >
          <Input.TextArea rows={4} placeholder="输入商品详细描述" />
        </Form.Item>

        {/* 新增：图片上传 */}
        <Form.Item
          name="ProductImage"
          label="商品图片"
          rules={[{ required: true, message: '请上传商品图片' }]}
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
                alt="预览" 
                style={{ maxWidth: '200px', maxHeight: '150px', backgroundImage: `url(${previewUrl})` }}
                className="rounded"
              />
            )}
            {isEditMode && !previewUrl && <span className="text-gray-500">当前无图片</span>}
          </div>
        </Form.Item>

        {/* 提交按钮 */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full"
            style={{ height: '40px' }}
          >
            {isEditMode ? '提交修改' : '提交添加'}
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